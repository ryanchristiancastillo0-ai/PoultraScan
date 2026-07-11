from pydantic import BaseModel, ConfigDict
from datetime import datetime
from enum import Enum


class ImageTypeSchema(str, Enum):
    WEBCAM = "WEBCAM"
    FRONT = "FRONT"
    LEFT = "LEFT"
    RIGHT = "RIGHT"


class CreateChickenImageSchema(BaseModel):
    detected_chicken_id: int
    image_type: ImageTypeSchema
    image_url: str


class ChickenImageResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    detected_chicken_id: int
    image_type: str
    image_url: str
    created_at: datetime