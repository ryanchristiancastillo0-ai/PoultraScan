from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from controllers.scan_session_controller import ScanSessionController
from schemas.scan_session_schema import CreateScanSessionSchema, UpdateScanSessionStatusSchema
from middleware.auth_middleware import get_current_user_id

router = APIRouter(
    prefix="/api/scan-sessions",
    tags=["Scan Sessions"]
)


@router.post("/")
def create_scan_session(
    data: CreateScanSessionSchema,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ScanSessionController.create(data, db)


@router.get("/{session_id}")
def get_scan_session_by_id(
    session_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ScanSessionController.get_by_id(session_id, db)


@router.get("/farm/{farm_id}")
def get_scan_sessions_by_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ScanSessionController.get_by_farm_id(farm_id, db)


@router.get("/")
def get_all_scan_sessions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ScanSessionController.get_all(skip, limit, db)


@router.put("/{session_id}/status")
def update_scan_session_status(
    session_id: int,
    data: UpdateScanSessionStatusSchema,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ScanSessionController.update_status(session_id, data, db)


@router.delete("/{session_id}")
def delete_scan_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ScanSessionController.delete(session_id, db)