"""
Uses Gemini vision to classify chicken disease status directly from an
image. Pure utility — only talks to Gemini and returns parsed results.
No DB writes and no business logic here (that stays in
ai_prediction_service.py).
"""

import os
import re
import json
import hashlib
import threading
from google import genai
from google.genai import types
from dotenv import load_dotenv

from utils.gemini_image_counter import GeminiCountingError, ImageQualityError

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Same free-tier fallback chain used elsewhere in the project.
FREE_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-3-flash-preview",
]

DEFAULT_IMAGE_QUALITY_MESSAGE = (
    "No chicken detected or the image is too blurry. "
    "Please align the camera on the chicken and hold steady, then try again."
)

CACHE_FILE = os.path.join("static", "cache", "disease_classifications.json")
os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)

_cache_lock = threading.Lock()


DISEASE_PROMPT = """
You are an expert poultry veterinary assistant analyzing a photo of a chicken
for a farm monitoring app. Farmers rely on this assessment to catch disease
early, so missing a real symptom is much more costly than a false alarm.
Do NOT default to HEALTHY just because you are uncertain — only choose
HEALTHY if you have positively confirmed the specific signs listed below.

STEP 1 — Image quality check:
- Is the image too blurry, out of focus, too dark, or otherwise unusable?
- Is at least one live chicken/rooster clearly visible anywhere in the frame?

STEP 2 — ONLY IF a chicken is clearly visible and the image is usable,
inspect every visible part of the bird systematically for signs of illness:
comb and wattle color/texture, eyes, nostrils/beak, feather condition,
posture and gait, visible skin, and droppings if visible in frame.

You are NOT limited to a fixed list of diseases. Identify the single most
likely condition based on what you actually observe, which may include (but
is not limited to) any of the following common poultry diseases:

- COCCIDIOSIS — ruffled/fluffed feathers, hunched posture, pale comb/wattles,
  lethargy, bloody or watery diarrhea
- FOWL_POX — wart-like crusty nodules or lesions on comb, wattles, eyes, or
  beak corners; yellowish plaques near mouth/eyes
- NEWCASTLE_DISEASE — labored breathing, nasal/eye discharge, twisted neck
  (torticollis), tremors, uncoordinated movement, paralysis, greenish diarrhea
- INFECTIOUS_BRONCHITIS — coughing, sneezing, nasal discharge, watery eyes,
  reduced activity
- MAREKS_DISEASE — leg or wing paralysis, irregular pupils, grey iris,
  skin nodules, weight loss
- AVIAN_INFLUENZA — swollen/discolored head or comb, respiratory distress,
  sudden severe lethargy, purple discoloration of comb/legs
- INFECTIOUS_CORYZA — facial swelling, swollen sinuses, nasal discharge,
  eyes swollen shut
- FOWL_CHOLERA — swollen wattles/joints, greenish diarrhea, sudden lethargy
- EXTERNAL_PARASITES — visible mites/lice, feather damage, skin irritation,
  excessive scratching/preening
- NUTRITIONAL_DEFICIENCY — poor feather quality, weakness, leg deformities,
  slow growth without other infection signs

If the bird clearly shows disease signs but they don't cleanly match any
known condition, use "UNKNOWN" rather than forcing a mismatched label — but
only after ruling out the conditions above. If you observe ANY concrete signs
of illness, do not classify as HEALTHY even if you're unsure exactly which
disease it is — use UNKNOWN in that case instead.

HEALTHY — only choose this if you positively observe: bright red upright
comb and wattles, smooth clean feathers, alert posture, clear eyes, normal
stance, and no lesions, discoloration, abnormal droppings, or other signs
from any category above.

Respond ONLY with valid JSON, no markdown, no code fences, in this exact format:
{
  "chicken_visible": <true or false>,
  "is_blurry": <true or false>,
  "quality_note": "<one short sentence explaining the issue if chicken_visible is false or is_blurry is true, otherwise empty string>",
  "disease": "<disease name in UPPER_SNAKE_CASE, e.g. COCCIDIOSIS, NEWCASTLE_DISEASE, HEALTHY, UNKNOWN, or another specific disease name if clearly applicable>",
  "confidence": <integer 0-100, how confident you are in this classification>,
  "reasoning": "<one or two sentences citing the SPECIFIC visual evidence observed that led to this classification>"
}

If chicken_visible is false or is_blurry is true, set "disease" to "HEALTHY"
and "confidence" to 0 as placeholders (they will be ignored).
"""


class DiseaseClassificationError(Exception):
    """Raised when every model in FREE_MODELS fails to return a usable
    disease classification (infra/parsing failure)."""
    pass


def _sanitize_confidence(raw_confidence) -> float:
    """Clamps to 0-100, defaults to 0 if garbage."""
    try:
        conf = float(raw_confidence)
    except (TypeError, ValueError):
        return 0.0
    return max(0.0, min(conf, 100.0))


def _sanitize_disease_name(raw_name) -> str:
    """
    Normalizes a free-text disease name into UPPER_SNAKE_CASE, e.g.
    "Newcastle Disease" -> "NEWCASTLE_DISEASE". Falls back to "UNKNOWN"
    if the model returned something empty or unusable. Capped at 100
    chars to match the DB column.
    """
    if not raw_name or not isinstance(raw_name, str):
        return "UNKNOWN"

    cleaned = raw_name.strip().upper()
    cleaned = re.sub(r"[^A-Z0-9]+", "_", cleaned).strip("_")

    if not cleaned:
        return "UNKNOWN"

    return cleaned[:100]


def _hash_image(image_bytes: bytes) -> str:
    return hashlib.sha256(image_bytes).hexdigest()


def _load_cache() -> dict:
    if not os.path.exists(CACHE_FILE):
        return {}
    try:
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return {}


def _save_cache(cache: dict):
    try:
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(cache, f, indent=2)
    except OSError as e:
        print(f"[CACHE WARNING] Failed to write disease classification cache: {e}")


def classify_disease_with_gemini(image_bytes: bytes) -> dict:
    """
    Asks Gemini to classify the chicken's disease status from the given
    image. Tries each model in FREE_MODELS in order until one succeeds.
    The disease name is open-ended (not restricted to a fixed list) —
    Gemini can surface any poultry disease it recognizes from the image.

    Results are cached on disk keyed by a SHA-256 hash of the exact image
    bytes — re-uploading the identical image skips the Gemini call
    entirely. A different photo (even of the same chicken) is a cache miss.

    Returns a dict with: disease_name (str, UPPER_SNAKE_CASE),
    confidence_score (float), reasoning (str), model_used (str),
    raw_response (dict)

    Raises:
        ImageQualityError: if Gemini determines the image is too blurry
            or no chicken is visible. Raised immediately rather than
            trying the next model. NOT cached, since the person will
            retake the photo.
        DiseaseClassificationError: if every model in FREE_MODELS fails
            to return a usable response.
    """
    image_hash = _hash_image(image_bytes)

    with _cache_lock:
        cache = _load_cache()
        if image_hash in cache:
            print(f"[DISEASE CACHE] Hit for image hash '{image_hash[:12]}...' — skipping Gemini call.")
            return cache[image_hash]

    mime_type = "image/jpeg"
    if image_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
        mime_type = "image/png"

    for model_name in FREE_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=[
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                    DISEASE_PROMPT
                ]
            )

            raw_text = response.text.strip()
            raw_text = raw_text.replace("```json", "").replace("```", "").strip()

            data = json.loads(raw_text)

            chicken_visible = data.get("chicken_visible", True)
            is_blurry = data.get("is_blurry", False)

            if not chicken_visible or is_blurry:
                quality_note = data.get("quality_note", "").strip()
                message = quality_note if quality_note else DEFAULT_IMAGE_QUALITY_MESSAGE
                print(f"[DISEASE DEBUG] Image quality issue via '{model_name}': {message}")
                raise ImageQualityError(message)

            disease_name = _sanitize_disease_name(data.get("disease", ""))
            confidence_score = round(_sanitize_confidence(data.get("confidence", 0)), 2)

            print(f"[DISEASE DEBUG] Success using model: {model_name} -> {disease_name} ({confidence_score}%)")

            result = {
                "disease_name": disease_name,
                "confidence_score": confidence_score,
                "reasoning": data.get("reasoning", ""),
                "model_used": model_name,
                "raw_response": data
            }

            with _cache_lock:
                cache = _load_cache()
                cache[image_hash] = result
                _save_cache(cache)

            print(f"[DISEASE CACHE] Stored new entry for image hash '{image_hash[:12]}...'.")

            return result

        except ImageQualityError:
            # Valid response from Gemini — just says the image can't be
            # used. Don't fall through to the next model, and don't cache
            # it — the person is expected to retake the photo.
            raise

        except Exception as e:
            print(f"[DISEASE DEBUG] Model '{model_name}' failed: {e}. Trying next model...")
            continue

    raise DiseaseClassificationError("All Gemini models failed to return a usable disease classification.")

def classify_diseases_batch_with_gemini(crop_images: list[bytes]) -> list[dict]:
    """
    Sends ALL chicken crops in a single Gemini request and asks for one
    classification per crop, returned as a JSON array in the same order
    the images were sent. Cuts N chickens down to 1 API call instead of N.
    """
    parts = []
    for img_bytes in crop_images:
        mime_type = "image/png" if img_bytes.startswith(b"\x89PNG\r\n\x1a\n") else "image/jpeg"
        parts.append(types.Part.from_bytes(data=img_bytes, mime_type=mime_type))

    batch_prompt = f"""
{DISEASE_PROMPT}

You are given {len(crop_images)} separate chicken images, in order, labeled
image_1 through image_{len(crop_images)}. Analyze EACH one independently
using the exact same rules above.

Respond ONLY with a valid JSON array (no markdown, no code fences) with
exactly {len(crop_images)} objects in the same order as the images, each
following the single-chicken JSON format described above.
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

            if not isinstance(data, list) or len(data) != len(crop_images):
                print(f"[BATCH DISEASE] '{model_name}' returned malformed/mismatched array length. Trying next model...")
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
                        "model_used": model_name,
                    })
                    continue

                results.append({
                    "disease_name": _sanitize_disease_name(item.get("disease", "")),
                    "confidence_score": round(_sanitize_confidence(item.get("confidence", 0)), 2),
                    "reasoning": item.get("reasoning", ""),
                    "model_used": model_name,
                })

            print(f"[BATCH DISEASE] Success using model: {model_name} -> {len(results)} results in 1 call")
            return results

        except Exception as e:
            print(f"[BATCH DISEASE] Model '{model_name}' failed: {e}. Trying next model...")
            continue

    raise DiseaseClassificationError("All Gemini models failed to return a usable batch classification.")