from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.database import get_db
from controllers.notification_controller import NotificationController
from schemas.notification_schema import CreateNotificationSchema, UpdateNotificationSchema
from middleware.auth_middleware import get_current_user_id

router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"]
)


@router.post("/")
def create_notification(
    data: CreateNotificationSchema,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return NotificationController.create(data, db)


@router.get("/{notification_id}")
def get_notification_by_id(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return NotificationController.get_by_id(notification_id, db)


@router.get("/user/{user_id}")
def get_notifications_by_user(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return NotificationController.get_by_user_id(user_id, skip, limit, db)


@router.get("/")
def get_all_notifications(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return NotificationController.get_all(skip, limit, db)


@router.put("/{notification_id}/read")
def mark_notification_as_read(
    notification_id: int,
    data: UpdateNotificationSchema,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return NotificationController.mark_as_read(notification_id, data, db)


@router.delete("/{notification_id}")
def delete_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user_id: int = Depends(get_current_user_id)
):
    return NotificationController.delete(notification_id, db)