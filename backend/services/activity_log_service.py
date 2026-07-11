from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.activity_log import ActivityLog
from schemas.activity_log_schema import CreateActivityLogSchema


class ActivityLogService:

    @staticmethod
    def create(db: Session, data: CreateActivityLogSchema) -> ActivityLog:
        new_log = ActivityLog(**data.model_dump())
        db.add(new_log)
        db.commit()
        db.refresh(new_log)
        return new_log

    @staticmethod
    def log_action(db: Session, user_id: int, action: str, ip_address: str | None = None) -> ActivityLog:
        """Convenience method so other services (auth, farms, etc.) can log actions inline."""
        new_log = ActivityLog(user_id=user_id, action=action, ip_address=ip_address)
        db.add(new_log)
        db.commit()
        db.refresh(new_log)
        return new_log

    @staticmethod
    def find_by_id(db: Session, log_id: int) -> ActivityLog:
        log = db.query(ActivityLog).filter(ActivityLog.id == log_id).first()
        if not log:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Activity log not found")
        return log

    @staticmethod
    def find_by_user_id(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> list[ActivityLog]:
        return (
            db.query(ActivityLog)
            .filter(ActivityLog.user_id == user_id)
            .order_by(ActivityLog.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[ActivityLog]:
        return (
            db.query(ActivityLog)
            .order_by(ActivityLog.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def delete(db: Session, log_id: int) -> None:
        log = ActivityLogService.find_by_id(db, log_id)
        db.delete(log)
        db.commit()