from sqlalchemy import Column, Integer, Text, DateTime, DECIMAL, ForeignKey
from sqlalchemy.sql import func
from database.base import Base


class ScanSummary(Base):
    __tablename__ = "scan_summaries"

    id = Column(Integer, primary_key=True, index=True)

    scan_session_id = Column(
        Integer,
        ForeignKey("scan_sessions.id"),
        nullable=False
    )

    total_detected = Column(Integer)

    healthy_count = Column(Integer)

    diseased_count = Column(Integer)

    market_ready_count = Column(Integer)

    average_weight = Column(DECIMAL(5,2))

    estimated_total_oil_ml = Column(DECIMAL(8,2))

    remarks = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())