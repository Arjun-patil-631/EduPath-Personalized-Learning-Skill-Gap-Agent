import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean
from app.database import Base

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    skill = Column(String, nullable=False)
    delta = Column(String, nullable=False)
    timestamp_str = Column(String, default="Just now")
    activity_type = Column(String, default="challenge")  # "challenge", "assessment", "module"
    is_highlight = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
