from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class CreateFarmSchema(BaseModel):
    farm_name: str
    location: str
    capacity: int


class UpdateFarmSchema(BaseModel):
    farm_name: Optional[str] = None
    location: Optional[str] = None
    capacity: Optional[int] = None


class FarmResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    farm_name: str
    location: str
    capacity: int
    image_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime