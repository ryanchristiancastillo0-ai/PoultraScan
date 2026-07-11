from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List
from enum import Enum


class ImageTypeSchema(str, Enum):
    WEBCAM = "WEBCAM"
    FRONT = "FRONT"
    LEFT = "LEFT"
    RIGHT = "RIGHT"


class ChickenPredictionSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    detected_chicken_id: int
    tracking_id: Optional[int] = None
    chicken_image_id: int
    image_url: str
    ai_prediction_id: int
    disease: str
    confidence: float
    healthy: bool
    reasoning: Optional[str] = None
    estimated_weight: float
    estimated_oil_ml: float
    market_ready: bool
    care_tips: str
    breed: Optional[str] = None
    recommendation: Optional[str] = None
    prevention_tips: Optional[str] = None
    severity: Optional[str] = None
    model_name: str
    model_version: str
    processing_time_ms: int
    created_at: datetime


class BatchPredictionResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    chickens: List[ChickenPredictionSchema]
    total_chickens: int
    total_weight: float
    total_oil_ml: float
    market_ready_count: int