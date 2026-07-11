"""
Pydantic schemas for the chicken detection endpoint's request/response bodies.
"""

from pydantic import BaseModel
from typing import List, Optional, Any


class BoundingBox(BaseModel):
    x: float
    y: float
    width: float
    height: float


class ChickenDetection(BaseModel):
    tracking_id: int
    confidence: float
    bounding_box: BoundingBox


class DetectionResponse(BaseModel):
    success: bool
    total_chickens: int
    detections: List[ChickenDetection]
    raw_response: Optional[Any] = None