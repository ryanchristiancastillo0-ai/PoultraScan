"""
Wraps Gemini API calls to generate poultry care tips and estimates
based on the AI model's disease prediction AND the actual scanned image.

Sends the photo itself to Gemini (vision-capable models) so weight/oil
estimates are based on what the chicken actually looks like in frame,
not just a blind guess from the disease label alone.
"""

import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

FREE_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-3-flash-preview",
]

MIN_REALISTIC_WEIGHT_KG = 0.1
MAX_REALISTIC_WEIGHT_KG = 8.0


class GeminiInsightsError(Exception):
    """Raised when every model in FREE_MODELS fails to return a usable
    batch insights response (e.g. quota/rate-limit exhaustion across
    all free-tier Gemini models). Callers can catch this to fall back
    to an alternate vision provider."""
    pass


def _build_prompt(disease: str, confidence: float) -> str:
    return f"""
You are a poultry health assistant for a chicken farm monitoring app.

You are given a photo of a live chicken. A separate AI model already classified it as:
- Disease: {disease}
- Confidence: {confidence}%

Look carefully at the chicken in the image (its size, body condition, posture) and estimate
realistic values based on what you actually see. A typical broiler chicken weighs between
1.0 and 3.5 kg — use the visual size of the bird in the photo to judge where it falls in
that range (or slightly outside it if the bird looks unusually small/large).

Respond ONLY with valid JSON, no markdown, no code fences, in this exact format:
{{
  "tips": "2-4 sentences of practical care/treatment advice for this condition",
  "estimated_weight": <number in kg, based on the chicken's visible size in the photo, realistic broiler range>,
  "estimated_oil_ml": <number in ml, rough estimated oil yield if processed, as a float>,
  "market_ready": <true or false, whether this chicken would be safe/ready for market>
}}

If disease is HEALTHY, market_ready should lean true and tips should be general maintenance advice.
If disease is COCCIDIOSIS, FOWL_POX, or NEWCASTLE, market_ready should be false and tips should focus on treatment/isolation.
"""


def _detect_mime_type(image_bytes: bytes) -> str:
    if image_bytes.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if image_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    return "image/jpeg"


def _sanitize_weight(raw_weight) -> float:
    try:
        weight = float(raw_weight)
    except (TypeError, ValueError):
        print(f"[WEIGHT DEBUG] Gemini returned non-numeric weight: {raw_weight!r}")
        return 0.0

    if weight < MIN_REALISTIC_WEIGHT_KG or weight > MAX_REALISTIC_WEIGHT_KG:
        print(
            f"[WEIGHT DEBUG] UNREALISTIC weight from Gemini: {weight} kg "
            f"(expected between {MIN_REALISTIC_WEIGHT_KG}-{MAX_REALISTIC_WEIGHT_KG} kg). "
            f"Returning 0.0 instead of a fake number."
        )
        return 0.0

    return round(weight, 3)


def get_disease_insights(disease: str, confidence: float, image_bytes: bytes) -> dict:
    """
    Single-chicken version. Kept for backward compatibility / fallback use.
    """
    prompt = _build_prompt(disease, confidence)
    mime_type = _detect_mime_type(image_bytes)

    for model_name in FREE_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=[
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                    prompt
                ]
            )

            raw_text = response.text.strip()
            raw_text = raw_text.replace("```json", "").replace("```", "").strip()
            data = json.loads(raw_text)

            print(f"Gemini insight generated successfully using model: {model_name}")

            return {
                "tips": data.get("tips", "No specific advice available."),
                "estimated_weight": _sanitize_weight(data.get("estimated_weight", 0.0)),
                "estimated_oil_ml": float(data.get("estimated_oil_ml", 0.0)),
                "market_ready": bool(data.get("market_ready", False))
            }

        except Exception as e:
            print(f"Model '{model_name}' failed: {e}. Trying next model...")
            continue

    print("All Gemini models failed. Returning fallback defaults.")
    return {
        "tips": "Unable to generate care tips at this time. Please consult a veterinarian.",
        "estimated_weight": 0.0,
        "estimated_oil_ml": 0.0,
        "market_ready": False
    }


def get_disease_insights_batch(items: list[dict]) -> list[dict]:
    """
    Batched version — one Gemini call for ALL chickens in a scan.

    items: list of {"disease": str, "confidence": float, "image_bytes": bytes},
    one per chicken, in order.

    Returns a list of insight dicts (tips, estimated_weight, estimated_oil_ml,
    market_ready) in the same order as `items`.

    Raises:
        GeminiInsightsError: if every model in FREE_MODELS fails to
            return a usable response. Callers can catch this to fall
            back to an alternate vision provider (e.g. OpenRouter)
            instead of silently getting zeroed-out defaults.
    """
    parts = []
    for item in items:
        mime_type = _detect_mime_type(item["image_bytes"])
        parts.append(types.Part.from_bytes(data=item["image_bytes"], mime_type=mime_type))

    disease_list_str = "\n".join(
        f"- image_{i+1}: disease={item['disease']}, confidence={item['confidence']}%"
        for i, item in enumerate(items)
    )

    batch_prompt = f"""
You are a poultry health assistant for a chicken farm monitoring app.

You are given {len(items)} separate chicken images, in order, labeled
image_1 through image_{len(items)}. Each has already been classified by
a separate AI model as follows:

{disease_list_str}

For EACH image, look carefully at that specific chicken (its size, body
condition, posture) and estimate realistic values based on what you
actually see in THAT image. A typical broiler chicken weighs between
1.0 and 3.5 kg — use the visual size of the bird in each photo to judge
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

    for model_name in FREE_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=parts + [batch_prompt]
            )

            raw_text = response.text.strip()
            raw_text = raw_text.replace("```json", "").replace("```", "").strip()
            data = json.loads(raw_text)

            if not isinstance(data, list) or len(data) != len(items):
                print(f"[BATCH INSIGHTS] '{model_name}' returned malformed/mismatched array length. Trying next model...")
                continue

            results = []
            for entry in data:
                results.append({
                    "tips": entry.get("tips", "No specific advice available."),
                    "estimated_weight": _sanitize_weight(entry.get("estimated_weight", 0.0)),
                    "estimated_oil_ml": float(entry.get("estimated_oil_ml", 0.0)),
                    "market_ready": bool(entry.get("market_ready", False)),
                })

            print(f"[BATCH INSIGHTS] Success using model: {model_name} -> {len(results)} results in 1 call")
            return results

        except Exception as e:
            print(f"[BATCH INSIGHTS] Model '{model_name}' failed: {e}. Trying next model...")
            continue

    raise GeminiInsightsError("All Gemini models failed to return a usable batch insights response.")