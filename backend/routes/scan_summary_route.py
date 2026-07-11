from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from controllers.scan_summary_controller import ScanSummaryController
from schemas.scan_summary_schema import CreateScanSummarySchema, UpdateScanSummarySchema
from middleware.auth_middleware import get_current_user_id

router = APIRouter(
    prefix="/api/scan-summaries",
    tags=["Scan Summaries"]
)


@router.post("/")
def create_scan_summary(
    data: CreateScanSummarySchema,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ScanSummaryController.create(data, db)


@router.get("/history/me")
def get_my_scan_history(
    skip: int = 0,
    limit: int = 10,
    search: str | None = None,
    farm_id: int | None = None,
    date_from: str | None = None,
    date_to: str | None = None,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ScanSummaryController.get_history(
        current_user_id, skip, limit, db, search, farm_id, date_from, date_to
    )

@router.get("/dashboard/me")
def get_my_dashboard_stats(
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ScanSummaryController.get_dashboard_stats(current_user_id, db)


@router.get("/{summary_id}")
def get_scan_summary_by_id(
    summary_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ScanSummaryController.get_by_id(summary_id, db)


@router.get("/session/{scan_session_id}")
def get_scan_summary_by_session(
    scan_session_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ScanSummaryController.get_by_scan_session_id(scan_session_id, db)


@router.get("/")
def get_all_scan_summaries(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ScanSummaryController.get_all(skip, limit, db)


@router.put("/{summary_id}")
def update_scan_summary(
    summary_id: int,
    data: UpdateScanSummarySchema,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ScanSummaryController.update(summary_id, data, db)


@router.delete("/{summary_id}")
def delete_scan_summary(
    summary_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ScanSummaryController.delete(summary_id, db)


@router.post("/generate/{scan_session_id}")
def generate_scan_summary(
    scan_session_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return ScanSummaryController.generate_for_session(scan_session_id, db)