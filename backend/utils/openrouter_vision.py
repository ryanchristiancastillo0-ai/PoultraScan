"""
OpenRouter fallback for chicken disease classification and weight/oil
insight estimation, used only when the Gemini free-tier batch calls
(classify_diseases_batch_with_gemini / get_disease_insights_batch) are
exhausted across all free Gemini models.

Mirrors the exact input/output shape of the Gemini batch functions so
they are drop-in swappable from ai_prediction_service.py.

NOTE: Free vision-capable model availability on OpenRouter changes over
time. Verify the models below are still free/available at
https://openrouter.ai/models (filter Price: Free, Capability: Vision)
periodically.
"""

import os
import json
import base64
from dotenv import load_dotenv
from openai import OpenAI

from utils.gemini_disease_classifier import (
    DISEASE_PROMPT,
    DEFAULT_IMAGE_QUALITY_MESSAGE,
    _sanitize_confidence,
    _sanitize_disease_name,
)
from utils.gemini_client import _sanitize_weight

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

client = OpenAI(
    api_key=OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1",
)

# Free-tier vision-capable models on OpenRouter, tried in order.
OPENROUTER_VISION_MODELS = [
    "meta-llama/llama-4-maverick:free",
    "google/gemma-4-31b-it:free",
    "qwen/qwen2.5-vl-72b-instruct:free",
]


class OpenRouterVisionError(Exception):
    """Raised when every model in OPENROUTER_VISION_MODELS fails to
    return a usable response for a batch vision call."""
    pass


def _detect_mime_type(image_bytes: bytes) -> str:
    if image_bytes.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if image_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    return "image/jpeg"


def _image_to_data_url(image_bytes: bytes) -> str:
    mime_type = _detect_mime_type(image_bytes)
    b64 = base64.b64encode(image_bytes).decode("utf-8")
    return f"data:{mime_type};base64,{b64}"


def _extract_json_array(raw_text: str):
    raw_text = (raw_text or "").strip()
    raw_text = raw_text.replace("```json", "").replace("```", "").strip()
    return json.loads(raw_text)


def classify_diseases_batch_openrouter(crop_images: list[bytes]) -> list[dict]:
    """
    OpenRouter fallback for classify_diseases_batch_with_gemini().
    Same input/output shape -- drop-in swappable.

    Returns a list of dicts: disease_name, confidence_score, reasoning,
    model_used -- one per image, same order as crop_images.

    Raises OpenRouterVisionError if every model in
    OPENROUTER_VISION_MODELS fails to return a usable batch response.
    """
    if not OPENROUTER_API_KEY:
        raise OpenRouterVisionError("OPENROUTER_API_KEY is not set.")

    batch_prompt = f"""
{DISEASE_PROMPT}

You are given {len(crop_images)} separate chicken images, in order, labeled
image_1 through image_{len(crop_images)}. Analyze EACH one independently
using the exact same rules above.

Respond ONLY with a valid JSON array (no markdown, no code fences) with
exactly {len(crop_images)} objects in the same order as the images, each
following the single-chicken JSON format described above.
"""

    content = [{"type": "text", "text": batch_prompt}]
    for img_bytes in crop_images:
        content.append({
            "type": "image_url",
            "image_url": {"url": _image_to_data_url(img_bytes)}
        })

    for model_name in OPENROUTER_VISION_MODELS:
        try:
            response = client.chat.completions.create(
                model=model_name,
                messages=[{"role": "user", "content": content}],
                temperature=0.4,
            )

            raw_text = response.choices[0].message.content
            data = _extract_json_array(raw_text)

            if not isinstance(data, list) or len(data) != len(crop_images):
                print(f"[OPENROUTER BATCH DISEASE] '{model_name}' returned malformed/mismatched array length. Trying next model...")
                continue

            results = []
            for item in data:
                chicken_visible = item.get("chicken_visible", True)
                is_blurry = item.get("is_blurry", False)

                if not chicken_visible or is_blurry:
                    results.append({
                        "disease_name": "UNKNOWN",
                        "confidence_score": 0.0,
                        "reasoning": item.get("quality_note", "").strip() or DEFAULT_IMAGE_QUALITY_MESSAGE,
                        "model_used": f"openrouter:{model_name}",
                    })
                    continue

                results.append({
                    "disease_name": _sanitize_disease_name(item.get("disease", "")),
                    "confidence_score": round(_sanitize_confidence(item.get("confidence", 0)), 2),
                    "reasoning": item.get("reasoning", ""),
                    "model_used": f"openrouter:{model_name}",
                })

            print(f"[OPENROUTER BATCH DISEASE] Success using model: {model_name} -> {len(results)} results in 1 call")
            return results

        except Exception as e:
            print(f"[OPENROUTER BATCH DISEASE] Model '{model_name}' failed: {e}. Trying next model...")
            continue

    raise OpenRouterVisionError("All OpenRouter vision models failed to return a usable batch classification.")


def get_disease_insights_batch_openrouter(items: list[dict]) -> list[dict]:
    """
    OpenRouter fallback for get_disease_insights_batch().
    Same input/output shape -- drop-in swappable.

    items: list of {"disease": str, "confidence": float, "image_bytes": bytes},
    one per chicken, in order.

    Returns a list of dicts: tips, estimated_weight, estimated_oil_ml,
    market_ready -- one per item, same order as items.

    Raises OpenRouterVisionError if every model in
    OPENROUTER_VISION_MODELS fails to return a usable batch response.
    """
    if not OPENROUTER_API_KEY:
        raise OpenRouterVisionError("OPENROUTER_API_KEY is not set.")

    disease_list_str = "\n".join(
        f"- image_{i+1}: disease={item['disease']}, confidence={item['confidence']}%"
        for i, item in enumerate(items)
    )

    prompt_text = f"""
You are a poultry health assistant for a chicken farm monitoring app.

You are given {len(items)} separate chicken images, in order, labeled
image_1 through image_{len(items)}. Each has already been classified by
a separate AI model as follows:

{disease_list_str}

For EACH image, look carefully at that specific chicken (its size, body
condition, posture) and estimate realistic values based on what you
actually see in THAT image. A typical broiler chicken weighs between
1.0 and 3.5 kg -- use the visual size of the bird in each photo to judge
where it falls in that range (or slightly outside it if unusually
small/large).

Respond ONLY with a valid JSON array (no markdown, no code fences) with
exactly {len(items)} objects in the same order as the images, each in
this exact format:
{{
  "tips": "2-4 sentences of practical care/treatment advice for this condition",
  "estimated_weight": <number in kg, based on that chicken's visible size>,
  "estimated_oil_ml": <number in ml, rough estimated oil yield if processed, as a float>,
  "market_ready": <true or false>
}}

If a chicken's disease is HEALTHY, market_ready should lean true and tips
should be general maintenance advice. If COCCIDIOSIS, FOWL_POX, or
NEWCASTLE, market_ready should be false and tips should focus on
treatment/isolation.
"""

    content = [{"type": "text", "text": prompt_text}]
    for item in items:
        content.append({
            "type": "image_url",
            "image_url": {"url": _image_to_data_url(item["image_bytes"])}
        })

    for model_name in OPENROUTER_VISION_MODELS:
        try:
            response = client.chat.completions.create(
                model=model_name,
                messages=[{"role": "user", "content": content}],
                temperature=0.4,
            )

            raw_text = response.choices[0].message.content
            data = _extract_json_array(raw_text)

            if not isinstance(data, list) or len(data) != len(items):
                print(f"[OPENROUTER BATCH INSIGHTS] '{model_name}' returned malformed/mismatched array length. Trying next model...")
                continue

            results = []
            for entry in data:
                results.append({
                    "tips": entry.get("tips", "No specific advice available."),
                    "estimated_weight": _sanitize_weight(entry.get("estimated_weight", 0.0)),
                    "estimated_oil_ml": float(entry.get("estimated_oil_ml", 0.0)),
                    "market_ready": bool(entry.get("market_ready", False)),
                })

            print(f"[OPENROUTER BATCH INSIGHTS] Success using model: {model_name} -> {len(results)} results in 1 call")
            return results

        except Exception as e:
            print(f"[OPENROUTER BATCH INSIGHTS] Model '{model_name}' failed: {e}. Trying next model...")
            continue

    raise OpenRouterVisionError("All OpenRouter vision models failed to return a usable batch insights response.")