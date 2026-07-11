from sqlalchemy.orm import Session
from fastapi import status
from fastapi.responses import JSONResponse

from services.scan_session_service import ScanSessionService
from schemas.scan_session_schema import (
    CreateScanSessionSchema,
    UpdateScanSessionStatusSchema,
    ScanSessionResponseSchema
)


class ScanSessionController:

    @staticmethod
    def create(data: CreateScanSessionSchema, db: Session):
        session = ScanSessionService.create(db, data)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "message": "Scan session created successfully",
                "session": ScanSessionResponseSchema.model_validate(session).model_dump(mode="json")
            }
        )

    @staticmethod
    def get_by_id(session_id: int, db: Session):
        session = ScanSessionService.find_by_id(db, session_id)
        return ScanSessionResponseSchema.model_validate(session)

    @staticmethod
    def get_by_farm_id(farm_id: int, db: Session):
        sessions = ScanSessionService.find_by_farm_id(db, farm_id)
        return [ScanSessionResponseSchema.model_validate(s) for s in sessions]

    @staticmethod
    def get_all(skip: int, limit: int, db: Session):
        sessions = ScanSessionService.get_all(db, skip, limit)
        return [ScanSessionResponseSchema.model_validate(s) for s in sessions]

    @staticmethod
    def update_status(session_id: int, data: UpdateScanSessionStatusSchema, db: Session):
        session = ScanSessionService.update_status(db, session_id, data)
        return ScanSessionResponseSchema.model_validate(session)

    @staticmethod
    def delete(session_id: int, db: Session):
        ScanSessionService.delete(db, session_id)
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)