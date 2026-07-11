from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.notification import Notification
from schemas.notification_schema import CreateNotificationSchema, UpdateNotificationSchema


class NotificationService:

    @staticmethod
    def create(db: Session, data: CreateNotificationSchema) -> Notification:
        new_notification = Notification(**data.model_dump())
        db.add(new_notification)
        db.commit()
        db.refresh(new_notification)
        return new_notification

    @staticmethod
    def find_by_id(db: Session, notification_id: int) -> Notification:
        notification = db.query(Notification).filter(Notification.id == notification_id).first()
        if not notification:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
        return notification

    @staticmethod
    def find_by_user_id(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> list[Notification]:
        return (
            db.query(Notification)
            .filter(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100) -> list[Notification]:
        return db.query(Notification).offset(skip).limit(limit).all()

    @staticmethod
    def mark_as_read(db: Session, notification_id: int, data: UpdateNotificationSchema) -> Notification:
        notification = NotificationService.find_by_id(db, notification_id)
        notification.is_read = data.is_read
        db.commit()
        db.refresh(notification)
        return notification

    @staticmethod
    def delete(db: Session, notification_id: int) -> None:
        notification = NotificationService.find_by_id(db, notification_id)
        db.delete(notification)
        db.commit()