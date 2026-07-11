"""
Loads the YOLO chicken detector/counter model (chicken_counter.pt) and uses
bounding box size to estimate chicken weight from a camera image.

IMPORTANT — READ THIS:
This model detects/counts chickens (bounding boxes). It does NOT output
weight directly. Weight below is estimated from bounding box area using
a power-law formula: weight_kg = A * (area_px ** B)

The constants WEIGHT_COEFFICIENT_A and WEIGHT_EXPONENT_B are PLACEHOLDERS.
You must calibrate them using your real camera setup:
  1. Fix your camera at a constant height/angle (this matters a lot).
  2. Weigh 8-10 real chickens on a scale.
  3. Photograph each one from the same fixed camera position.
  4. Run detection on each photo, record bbox area (in pixels) vs known weight.
  5. Fit weight = A * area^B (log-log linear regression, or just curve_fit
     from scipy) using that data.
  6. Replace the two constants below with your fitted values.

Without calibration, these weight numbers are guesses and should not be
trusted for anything real.
"""

import os
import io
from typing import Dict

import numpy as np
from PIL import Image
from ultralytics import YOLO

MODEL_PATH = os.path.join("models", "chicken_counter.pt")

CONFIDENCE_THRESHOLD = 0.4

# --- CALIBRATION CONSTANTS (placeholders — see docstring above) ---
WEIGHT_COEFFICIENT_A = 0.00005
WEIGHT_EXPONENT_B = 1.35


class ChickenWeightEstimator:
    _model = None

    @classmethod
    def get_model(cls) -> YOLO:
        """Loads the YOLO model once and caches it (avoids reloading per request)."""
        if cls._model is None:
            if not os.path.exists(MODEL_PATH):
                raise FileNotFoundError(
                    f"chicken_counter.pt not found at '{MODEL_PATH}'. "
                    f"Make sure it's placed at backend/models/chicken_counter.pt"
                )
            cls._model = YOLO(MODEL_PATH)
        return cls._model

    @staticmethod
    def _bbox_area(box) -> float:
        x1, y1, x2, y2 = box
        width = x2 - x1
        height = y2 - y1
        return float(width * height)

    @staticmethod
    def _estimate_weight_from_area(area_px: float) -> float:
        """Power-law estimate. Replace constants once calibrated (see docstring)."""
        weight_kg = WEIGHT_COEFFICIENT_A * (area_px ** WEIGHT_EXPONENT_B)
        return round(weight_kg, 3)

    @classmethod
    def detect_and_estimate(cls, image_bytes: bytes) -> Dict:
        """
        Runs YOLO detection on raw image bytes.

        Returns:
            {
                "chicken_count": int,
                "detections": [
                    {"confidence": float, "bbox": [x1, y1, x2, y2], "estimated_weight_kg": float},
                    ...
                ],
                "average_weight_kg": float  # 0.0 if nothing detected
            }
        """
        model = cls.get_model()

        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image_np = np.array(image)

        results = model.predict(image_np, conf=CONFIDENCE_THRESHOLD, verbose=False)

        detections = []
        for result in results:
            boxes = result.boxes
            if boxes is None:
                continue
            for box in boxes:
                xyxy = box.xyxy[0].tolist()  # [x1, y1, x2, y2]
                confidence = float(box.conf[0])
                area_px = cls._bbox_area(xyxy)
                estimated_weight = cls._estimate_weight_from_area(area_px)

                detections.append({
                    "confidence": round(confidence, 3),
                    "bbox": [round(v, 1) for v in xyxy],
                    "estimated_weight_kg": estimated_weight
                })

        chicken_count = len(detections)
        average_weight = (
            round(sum(d["estimated_weight_kg"] for d in detections) / chicken_count, 3)
            if chicken_count > 0 else 0.0
        )

        return {
            "chicken_count": chicken_count,
            "detections": detections,
            "average_weight_kg": average_weight
        }