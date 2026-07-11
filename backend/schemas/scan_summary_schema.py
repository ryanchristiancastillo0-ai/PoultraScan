from pydantic import BaseModel, ConfigDict
from datetime import datetime
from decimal import Decimal
from typing import Optional


class CreateScanSummarySchema(BaseModel):
    scan_session_id: int
    total_detected: Optional[int] = None
    healthy_count: Optional[int] = None
    diseased_count: Optional[int] = None
    market_ready_count: Optional[int] = None
    average_weight: Optional[Decimal] = None
    estimated_total_oil_ml: Optional[Decimal] = None
    remarks: Optional[str] = None


class UpdateScanSummarySchema(BaseModel):
    total_detected: Optional[int] = None
    healthy_count: Optional[int] = None
    diseased_count: Optional[int] = None
    market_ready_count: Optional[int] = None
    average_weight: Optional[Decimal] = None
    estimated_total_oil_ml: Optional[Decimal] = None
    remarks: Optional[str] = None


class ScanSummaryResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    scan_session_id: int
    total_detected: Optional[int]
    healthy_count: Optional[int]
    diseased_count: Optional[int]
    market_ready_count: Optional[int]
    average_weight: Optional[Decimal]
    estimated_total_oil_ml: Optional[Decimal]
    remarks: Optional[str]
    created_at: datetime


class ScanHistoryItemSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    summary_id: int
    scan_session_id: int
    farm_name: str
    location: str
    scan_type: str
    status: str
    started_at: datetime
    finished_at: Optional[datetime]
    total_detected: Optional[int]
    healthy_count: Optional[int]
    diseased_count: Optional[int]
    market_ready_count: Optional[int]
    average_weight: Optional[Decimal]
    estimated_total_oil_ml: Optional[Decimal]
    remarks: Optional[str]
    thumbnail_url: Optional[str]


class DiseaseBreakdownItemSchema(BaseModel):
    disease: str
    count: int


class FarmHealthIndexItemSchema(BaseModel):
    farm_id: int
    farm_name: str
    health_percentage: float
    total_detected: int


class RecentEventSchema(BaseModel):
    type: str  # "anomaly" | "completed"
    title: str
    farm_name: str
    created_at: datetime


class DashboardStatsSchema(BaseModel):
    total_scans: int
    total_birds_detected: int
    total_farms: int
    healthy_percentage: float
    anomalies_detected: int
    disease_breakdown: list[DiseaseBreakdownItemSchema]
    farm_health_index: list[FarmHealthIndexItemSchema]
    recent_scans: list[ScanHistoryItemSchema]
    recent_events: list[RecentEventSchema]