from sqlalchemy.orm import Session
from fastapi import status
from fastapi.responses import JSONResponse

from services.notification_service import NotificationService
from schemas.notification_schema import (
    CreateNotificationSchema,
    UpdateNotificationSchema,
    NotificationResponseSchema
)


class NotificationController:

    @staticmethod
    def create(data: CreateNotificationSchema, db: Session):
        notification = NotificationService.create(db, data)
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={
                "message": "Notification created successfully",
                "notification": NotificationResponseSchema.model_validate(notification).model_dump(mode="json")
            }
        )

    @staticmethod
    def get_by_id(notification_id: int, db: Session):
        notification = NotificationService.find_by_id(db, notification_id)
        return NotificationResponseSchema.model_validate(notification)

    @staticmethod
    def get_by_user_id(user_id: int, skip: int, limit: int, db: Session):
        notifications = NotificationService.find_by_user_id(db, user_id, skip, limit)
        return [NotificationResponseSchema.model_validate(n) for n in notifications]

    @staticmethod
    def get_all(skip: int, limit: int, db: Session):
        notifications = NotificationService.get_all(db, skip, limit)
        return [NotificationResponseSchema.model_validate(n) for n in notifications]

    @staticmethod
    def mark_as_read(notification_id: int, data: UpdateNotificationSchema, db: Session):
        notification = NotificationService.mark_as_read(db, notification_id, data)
        return NotificationResponseSchema.model_validate(notification)

    @staticmethod
    def delete(notification_id: int, db: Session):
        NotificationService.delete(db, notification_id)
        return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)