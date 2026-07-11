"""
Isolates all Roboflow HTTP request logic. No business logic here —
this file's only job is to talk to the Roboflow Serverless API and
return raw JSON or raise a clear exception.
"""

import os
import base64
import requests
from dotenv import load_dotenv

load_dotenv()

# Load Roboflow config from environment variables — never hardcode these.
ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY")
ROBOFLOW_MODEL_ID = os.getenv("ROBOFLOW_MODEL_ID")
ROBOFLOW_API_URL = os.getenv("ROBOFLOW_API_URL")

# Fail fast at import time if critical env vars are missing — better to
# crash on startup than silently fail on the first real request.
if not ROBOFLOW_API_KEY:
    raise RuntimeError("ROBOFLOW_API_KEY is not set in environment variables.")
if not ROBOFLOW_MODEL_ID:
    raise RuntimeError("ROBOFLOW_MODEL_ID is not set in environment variables.")
if not ROBOFLOW_API_URL:
    raise RuntimeError("ROBOFLOW_API_URL is not set in environment variables.")

REQUEST_TIMEOUT_SECONDS = 30

# Lowered from Roboflow's default (40) to reduce false negatives while
# debugging why detections are coming back empty. Once confirmed working,
# raise this back up to cut down on low-quality/noisy detections.
CONFIDENCE_THRESHOLD = 10   # 0-100 scale
OVERLAP_THRESHOLD = 30      # 0-100 scale, controls NMS box merging


class RoboflowAPIError(Exception):
    """Raised when Roboflow returns a non-success response."""
    def __init__(self, message: str, status_code: int = None):
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class RoboflowTimeoutError(Exception):
    """Raised when the Roboflow request times out."""
    pass


def run_chicken_detection(image_bytes: bytes) -> dict:
    """
    Sends image bytes to the Roboflow Serverless API for inference and
    returns the raw parsed JSON response.

    Roboflow's legacy inference endpoint accepts a base64-encoded image
    as the request body (application/x-www-form-urlencoded), with the
    model ID in the URL path and the API key as a query parameter.

    Raises:
        RoboflowTimeoutError: if the request times out.
        RoboflowAPIError: if Roboflow returns a non-200 response
                           (including invalid API key, bad model ID, etc.)
    """
    # Roboflow expects the image as a base64 string in the request body.
    encoded_image = base64.b64encode(image_bytes).decode("ascii")

    url = f"{ROBOFLOW_API_URL}/{ROBOFLOW_MODEL_ID}"
    params = {
        "api_key": ROBOFLOW_API_KEY,
        "confidence": CONFIDENCE_THRESHOLD,
        "overlap": OVERLAP_THRESHOLD
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    # DEBUG: show exactly what's being sent, minus the actual image data
    # and API key, so you can confirm the model ID/URL are correct.
    print(f"[ROBOFLOW DEBUG] Requesting: {url}")
    print(f"[ROBOFLOW DEBUG] Params: confidence={CONFIDENCE_THRESHOLD}, overlap={OVERLAP_THRESHOLD}")
    print(f"[ROBOFLOW DEBUG] Image size: {len(image_bytes)} bytes, base64 length: {len(encoded_image)}")

    try:
        response = requests.post(
            url,
            params=params,
            data=encoded_image,
            headers=headers,
            timeout=REQUEST_TIMEOUT_SECONDS
        )
    except requests.exceptions.Timeout:
        raise RoboflowTimeoutError(
            f"Roboflow API request timed out after {REQUEST_TIMEOUT_SECONDS} seconds."
        )
    except requests.exceptions.ConnectionError as e:
        raise RoboflowAPIError(f"Could not connect to Roboflow API: {str(e)}")

    print(f"[ROBOFLOW DEBUG] Response status: {response.status_code}")

    # Roboflow returns 401 for invalid/missing API keys.
    if response.status_code == 401:
        raise RoboflowAPIError(
            "Roboflow rejected the request: invalid API key.",
            status_code=401
        )

    # 404 usually means a bad model_id (wrong slug or version number).
    if response.status_code == 404:
        raise RoboflowAPIError(
            f"Roboflow model not found. Check ROBOFLOW_MODEL_ID='{ROBOFLOW_MODEL_ID}'.",
            status_code=404
        )

    if response.status_code != 200:
        raise RoboflowAPIError(
            f"Roboflow API returned status {response.status_code}: {response.text}",
            status_code=response.status_code
        )

    try:
        result = response.json()
    except ValueError:
        raise RoboflowAPIError("Roboflow returned a non-JSON response.")

    # DEBUG: print the full raw response so we can see exactly what
    # Roboflow returned — including image dimensions and every prediction
    # (or confirm the predictions array really is empty).
    print(f"[ROBOFLOW DEBUG] Full raw response: {result}")

    return result