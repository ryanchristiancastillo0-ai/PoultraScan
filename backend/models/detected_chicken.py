from sqlalchemy import Column, Integer, Float, DECIMAL, DateTime, ForeignKey
from sqlalchemy.sql import func
from database.base import Base


class DetectedChicken(Base):
    __tablename__ = "detected_chickens"

    id = Column(Integer, primary_key=True, index=True)

    scan_session_id = Column(
        Integer,
        ForeignKey("scan_sessions.id"),
        nullable=False
    )

    tracking_id = Column(Integer)

    confidence = Column(DECIMAL(5,2))

    bounding_box_x = Column(Float)

    bounding_box_y = Column(Float)

    bounding_box_width = Column(Float)

    bounding_box_height = Column(Float)

    created_at = Column(DateTime(timezone=True), server_default=func.now())