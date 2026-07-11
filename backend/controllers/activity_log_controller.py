from sqlalchemy.orm import Session
from fastapi import status
from fastapi.responses import JSONResponse

from services.activity_log_service import ActivityLogService
from schemas.activity_log_schema import CreateActivityLogSchema, ActivityLogResponseSchema


class ActivityLogController:

    @staticmethod
    def create(data: CreateActivityLogSchema, db: Session):
        log = ActivityLogService.create(db, data)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "message": "Activity log created successfully",
                "log": ActivityLogResponseSchema.model_validate(log).model_dump(mode="json")
            }
        )

    @staticmethod
    def get_by_id(log_id: int, db: Session):
        log = ActivityLogService.find_by_id(db, log_id)
        return ActivityLogResponseSchema.model_validate(log)

    @staticmethod
    def get_by_user_id(user_id: int, skip: int, limit: int, db: Session):
        logs = ActivityLogService.find_by_user_id(db, user_id, skip, limit)
        return [ActivityLogResponseSchema.model_validate(l) for l in logs]

    @staticmethod
    def get_all(skip: int, limit: int, db: Session):
        logs = ActivityLogService.get_all(db, skip, limit)
        return [ActivityLogResponseSchema.model_validate(l) for l in logs]

    @staticmethod
    def delete(log_id: int, db: Session):
        ActivityLogService.delete(db, log_id)
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)