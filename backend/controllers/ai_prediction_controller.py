from sqlalchemy.orm import Session
from fastapi import UploadFile

from services.ai_prediction_service import AIPredictionService
from schemas.ai_prediction_schema import BatchPredictionResponseSchema, ChickenPredictionSchema


class AIPredictionController:

    @staticmethod
    def predict(scan_session_id: int, image_type: str, file: UploadFile, db: Session):
        result = AIPredictionService.predict(db, scan_session_id, image_type, file)
        return BatchPredictionResponseSchema.model_validate(result)

    @staticmethod
    def get_by_session(scan_session_id: int, db: Session):
        results = AIPredictionService.get_predictions_for_session(db, scan_session_id)
        return [ChickenPredictionSchema.model_validate(r) for r in results]