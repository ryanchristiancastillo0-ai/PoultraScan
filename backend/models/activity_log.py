from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from database.base import Base


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    action = Column(String(150), nullable=False)

    ip_address = Column(String(45))

    created_at = Column(DateTime(timezone=True), server_default=func.now())