"""
Business logic for chicken detection. Talks to the Gemini counting util
for inference, persists DetectedChicken records, and shapes the final
result. Controllers should never touch Gemini or the DB directly — only
this service does.
"""

from sqlalchemy.orm import Session

from utils.gemini_image_counter import count_chickens_with_gemini, GeminiCountingError
from models.detected_chicken import DetectedChicken
from models.chicken_image import ChickenImage
from models.ai_prediction import AIPrediction


class DetectionService:

    @staticmethod
    def detect_and_count(db: Session, scan_session_id: int, image_bytes: bytes) -> dict:
        """
        Runs Gemini vision inference on the given image to detect and count
        chickens, persists one DetectedChicken row per detection (with real
        bounding box + confidence from Gemini), and returns a summary dict.

        Clears out any previously stored detections (and their child
        ChickenImage/AIPrediction rows) for this scan_session_id first, so
        repeated test scans on the same session don't pile up and get
        reprocessed together on the next /api/ai/predict call.

        Raises:
            GeminiCountingError: propagated from the util, handled by the controller.
        """
        gemini_result = count_chickens_with_gemini(image_bytes)

        total_chickens = gemini_result["total_chickens"]
        confidence_note = gemini_result["confidence_note"]

        print(f"[DETECTION DEBUG] Gemini counted: {total_chickens} chickens ({confidence_note})")

        # Clear previous detections (and their child rows) for this session
        # so old test scans don't pile up and get reprocessed later.
        old_chickens = db.query(DetectedChicken).filter(
            DetectedChicken.scan_session_id == scan_session_id
        ).all()
        for old in old_chickens:
            db.query(ChickenImage).filter(ChickenImage.detected_chicken_id == old.id).delete()
            db.query(AIPrediction).filter(AIPrediction.detected_chicken_id == old.id).delete()
            db.delete(old)
        db.commit()

        detections = []

        for index, detection in enumerate(gemini_result["detections"], start=1):
            detected_chicken = DetectedChicken(
                scan_session_id=scan_session_id,
                tracking_id=index,
                confidence=detection["confidence"],
                bounding_box_x=detection["x"],
                bounding_box_y=detection["y"],
                bounding_box_width=detection["width"],
                bounding_box_height=detection["height"]
            )
            db.add(detected_chicken)

            detections.append({
                "tracking_id": index,
                "confidence": detection["confidence"],
                "bounding_box": {
                    "x": detection["x"],
                    "y": detection["y"],
                    "width": detection["width"],
                    "height": detection["height"]
                }
            })

        db.commit()

        return {
            "success": True,
            "total_chickens": total_chickens,
            "confidence_note": confidence_note,
            "detections": detections,
            "raw_response": gemini_result["raw_response"]
        }