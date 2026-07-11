from sqlalchemy.orm import Session
from fastapi import status
from fastapi.responses import JSONResponse

from services.scan_summary_service import ScanSummaryService
from schemas.scan_summary_schema import (
    CreateScanSummarySchema,
    UpdateScanSummarySchema,
    ScanSummaryResponseSchema,
)


class ScanSummaryController:

    @staticmethod
    def create(data: CreateScanSummarySchema, db: Session):
        summary = ScanSummaryService.create(db, data)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "message": "Scan summary created successfully",
                "summary": ScanSummaryResponseSchema.model_validate(summary).model_dump(mode="json")
            }
        )

    @staticmethod
    def get_by_id(summary_id: int, db: Session):
        summary = ScanSummaryService.find_by_id(db, summary_id)
        return ScanSummaryResponseSchema.model_validate(summary)

    @staticmethod
    def get_by_scan_session_id(scan_session_id: int, db: Session):
        summary = ScanSummaryService.find_by_scan_session_id(db, scan_session_id)
        return ScanSummaryResponseSchema.model_validate(summary)

    @staticmethod
    def get_all(skip: int, limit: int, db: Session):
        summaries = ScanSummaryService.get_all(db, skip, limit)
        return [ScanSummaryResponseSchema.model_validate(s) for s in summaries]

    @staticmethod
    def update(summary_id: int, data: UpdateScanSummarySchema, db: Session):
        summary = ScanSummaryService.update(db, summary_id, data)
        return ScanSummaryResponseSchema.model_validate(summary)

    @staticmethod
    def delete(summary_id: int, db: Session):
        ScanSummaryService.delete(db, summary_id)
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)

    @staticmethod
    def generate_for_session(scan_session_id: int, db: Session):
        summary = ScanSummaryService.generate_for_session(db, scan_session_id)
        return ScanSummaryResponseSchema.model_validate(summary)

    @staticmethod
    def get_history(
        user_id: int,
        skip: int,
        limit: int,
        db: Session,
        search: str | None = None,
        farm_id: int | None = None,
        date_from: str | None = None,
        date_to: str | None = None,
    ):
        history = ScanSummaryService.get_history_for_user(
            db, user_id, skip, limit, search, farm_id, date_from, date_to
        )
        return history

    @staticmethod
    def get_dashboard_stats(user_id: int, db: Session):
        return ScanSummaryService.get_dashboard_stats_for_user(db, user_id)