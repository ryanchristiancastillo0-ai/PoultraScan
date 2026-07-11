from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class CreateJournalEntrySchema(BaseModel):
    farm_id: Optional[int] = None
    scan_session_id: Optional[int] = None
    title: str
    content: str


class UpdateJournalEntrySchema(BaseModel):
    farm_id: Optional[int] = None
    scan_session_id: Optional[int] = None
    title: Optional[str] = None
    content: Optional[str] = None


class JournalEntryResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    farm_id: Optional[int]
    scan_session_id: Optional[int]
    title: str
    content: str
    created_at: datetime
    updated_at: datetime