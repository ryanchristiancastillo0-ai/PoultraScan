"""
Uses Gemini vision to detect and count chickens directly from an image,
including approximate bounding boxes and per-chicken confidence. Pure
utility — only talks to Gemini and returns parsed results. No DB writes
and no business logic here (that stays in detection_service.py).
"""

import os
import json
import io
from PIL import Image
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Same free-tier fallback chain used elsewhere in the project.
FREE_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-3-flash-preview",
]

MIN_REALISTIC_COUNT = 0
MAX_REALISTIC_COUNT = 500

DEFAULT_IMAGE_QUALITY_MESSAGE = (
    "No chicken detected or the image is too blurry. "
    "Please align the camera on the chicken and hold steady, then try again."
)


DETECTION_PROMPT = """
You are a poultry counting assistant for a chicken farm monitoring app.

First, assess the overall quality of the photo:
- Is the image too blurry, out of focus, too dark, or otherwise unusable to
  reliably identify a chicken?
- Is at least one live chicken/rooster clearly visible anywhere in the frame
  (including partially visible ones at the edges)?

Then, ONLY IF at least one chicken is visible and the image is not too blurry,
look carefully at the photo and identify every individual live chicken/rooster
visible in the frame, including partially visible ones at the edges, and birds
that are close together or overlapping — look carefully at heads, tails, and
leg positions to separate individual birds in crowded areas.

For EACH chicken you identify, provide a bounding box and a confidence score.

Respond ONLY with valid JSON, no markdown, no code fences, in this exact format:
{
  "chicken_visible": <true or false, whether at least one chicken is clearly visible>,
  "is_blurry": <true or false, whether the image is too blurry/unfocused/dark to analyze reliably>,
  "quality_note": "<one short sentence explaining the issue if chicken_visible is false or is_blurry is true, otherwise empty string>",
  "detections": [
    {
      "box_2d": [ymin, xmin, ymax, xmax],
      "confidence": <integer 0-100, how confident you are this is a real, distinct chicken>
    }
  ],
  "confidence_note": "<one short sentence on overall confidence, e.g. mentioning heavy overlap or occlusion>"
}

box_2d coordinates must be normalized to a 0-1000 scale relative to the image
(ymin/xmin = top-left corner, ymax/xmax = bottom-right corner), following
standard object detection convention. If chicken_visible is false or is_blurry
is true, return an empty detections array.
"""


class GeminiCountingError(Exception):
    """Raised when every model in FREE_MODELS fails to return a usable result
    (e.g. API errors, malformed responses). This is an infra/model failure,
    not a comment on the image content."""
    pass


class ImageQualityError(Exception):
    """Raised when Gemini successfully analyzed the image but determined it
    can't be used — no chicken visible and/or the image is too blurry. This
    is a user-actionable error, distinct from GeminiCountingError."""
    pass


def _detect_mime_type(image_bytes: bytes) -> str:
    if image_bytes.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if image_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    return "image/jpeg"


def _get_image_dimensions(image_bytes: bytes) -> tuple[int, int]:
    image = Image.open(io.BytesIO(image_bytes))
    return image.size  # (width, height)


def _sanitize_confidence(raw_confidence) -> float:
    """Clamps to 0-100, defaults to 0 if garbage."""
    try:
        conf = float(raw_confidence)
    except (TypeError, ValueError):
        return 0.0
    return max(0.0, min(conf, 100.0))


def _convert_box_2d_to_pixel_box(box_2d: list, image_width: int, image_height: int) -> dict:
    """
    Converts Gemini's [ymin, xmin, ymax, xmax] on a 0-1000 normalized scale
    into pixel-space center x/y + width/height, matching the format the
    rest of the app (and the old Roboflow response) already expects.
    """
    ymin, xmin, ymax, xmax = box_2d

    xmin_px = (xmin / 1000) * image_width
    xmax_px = (xmax / 1000) * image_width
    ymin_px = (ymin / 1000) * image_height
    ymax_px = (ymax / 1000) * image_height

    width = xmax_px - xmin_px
    height = ymax_px - ymin_px
    center_x = xmin_px + width / 2
    center_y = ymin_px + height / 2

    return {
        "x": round(center_x, 2),
        "y": round(center_y, 2),
        "width": round(width, 2),
        "height": round(height, 2)
    }


def _sanitize_detections(raw_detections: list, image_width: int, image_height: int) -> list[dict]:
    """Converts and validates each raw Gemini detection into a clean dict."""
    cleaned = []

    for det in raw_detections:
        box_2d = det.get("box_2d")
        if not box_2d or len(box_2d) != 4:
            print(f"[COUNT DEBUG] Skipping detection with malformed box_2d: {det}")
            continue

        try:
            pixel_box = _convert_box_2d_to_pixel_box(box_2d, image_width, image_height)
        except (TypeError, ValueError, ZeroDivisionError) as e:
            print(f"[COUNT DEBUG] Skipping detection, failed to convert box_2d: {e}")
            continue

        cleaned.append({
            "confidence": _sanitize_confidence(det.get("confidence", 0)),
            **pixel_box
        })

    if len(cleaned) > MAX_REALISTIC_COUNT:
        print(f"[COUNT DEBUG] UNREALISTIC detection count: {len(cleaned)}. Truncating.")
        cleaned = cleaned[:MAX_REALISTIC_COUNT]

    return cleaned


def count_chickens_with_gemini(image_bytes: bytes) -> dict:
    """
    Asks Gemini to detect and count chickens, with bounding boxes and
    per-chicken confidence, from the full image.

    Tries each model in FREE_MODELS in order until one succeeds.

    Returns a dict with: total_chickens (int), detections (list of
    {confidence, x, y, width, height}), confidence_note (str),
    model_used (str), raw_response (dict)

    Raises:
        ImageQualityError: if Gemini determines the image is too blurry
            or no chicken is visible. This is a user-fixable issue, so
            it is raised immediately rather than trying the next model.
        GeminiCountingError: if every model in FREE_MODELS fails to
            return a usable response (infra/parsing failure).
    """
    mime_type = _detect_mime_type(image_bytes)
    image_width, image_height = _get_image_dimensions(image_bytes)

    for model_name in FREE_MODELS:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=[
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                    DETECTION_PROMPT
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
                print(f"[GEMINI COUNT] Image quality issue via '{model_name}': {message}")
                raise ImageQualityError(message)

            raw_detections = data.get("detections", [])
            detections = _sanitize_detections(raw_detections, image_width, image_height)

            # Belt-and-suspenders: even if Gemini said a chicken was visible
            # but returned zero usable detections, treat it as a quality issue
            # rather than silently returning a "0 chickens" success result.
            if len(detections) == 0:
                print(f"[GEMINI COUNT] '{model_name}' reported chicken_visible=True but returned no usable detections.")
                raise ImageQualityError(DEFAULT_IMAGE_QUALITY_MESSAGE)

            print(f"[GEMINI COUNT] Success using model: {model_name} -> {len(detections)} chickens")

            return {
                "total_chickens": len(detections),
                "detections": detections,
                "confidence_note": data.get("confidence_note", ""),
                "model_used": model_name,
                "raw_response": data
            }

        except ImageQualityError:
            # This is a valid, successful response from Gemini — just one
            # that says the image can't be used. Don't fall through to the
            # next model; propagate straight to the controller.
            raise

        except Exception as e:
            print(f"[GEMINI COUNT] Model '{model_name}' failed: {e}. Trying next model...")
            continue

    raise GeminiCountingError("All Gemini models failed to return a usable chicken count.")