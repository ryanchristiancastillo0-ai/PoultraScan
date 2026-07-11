from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session

from database.database import get_db
from controllers.ai_prediction_controller import AIPredictionController
from schemas.ai_prediction_schema import ImageTypeSchema
from middleware.auth_middleware import get_current_user_id

router = APIRouter(
    prefix="/api/ai",
    tags=["AI Prediction"]
)


@router.post("/predict")
def predict_disease(
    scan_session_id: int = Form(...),
    image_type: ImageTypeSchema = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return AIPredictionController.predict(scan_session_id, image_type.value, file, db)


@router.get("/session/{scan_session_id}")
def get_predictions_by_session(
    scan_session_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return AIPredictionController.get_by_session(scan_session_id, db)