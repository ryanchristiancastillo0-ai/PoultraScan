"""
Route definitions for the chicken detection feature.
Only wires up the endpoint and dependency injection — no logic here.
"""

from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session

from controllers.detection_controller import DetectionController
from database.database import get_db
from schemas.detection_schema import DetectionResponse

router = APIRouter(prefix="/api/detection", tags=["Detection"])


@router.post("/count", response_model=DetectionResponse)
async def count_chickens(
    scan_session_id: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Accepts a multipart/form-data image upload, runs Roboflow chicken
    detection, persists one DetectedChicken row per detection, and
    returns the total count + individual detections.
    """
    return DetectionController.count_chickens(
        db=db,
        scan_session_id=scan_session_id,
        file=image
    )