from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class CreateActivityLogSchema(BaseModel):
    user_id: int
    action: str
    ip_address: Optional[str] = None


class ActivityLogResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    action: str
    ip_address: Optional[str]
    created_at: datetime