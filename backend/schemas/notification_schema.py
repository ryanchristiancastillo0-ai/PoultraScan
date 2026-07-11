from pydantic import BaseModel, ConfigDict
from datetime import datetime


class CreateNotificationSchema(BaseModel):
    user_id: int
    title: str
    message: str


class UpdateNotificationSchema(BaseModel):
    is_read: bool


class NotificationResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    title: str
    message: str
    is_read: bool
    created_at: datetime