import datetime
from sqlalchemy import Column, String, Integer, Text, ForeignKey, DateTime, JSON
from app.database import Base

class EvaluationRecord(Base):
    __tablename__ = "evaluation_records"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    challenge_id = Column(String, ForeignKey("challenges.id"), nullable=False)
    challenge_title = Column(String, nullable=False)
    score = Column(Integer, nullable=False, default=100)
    tests_passed = Column(Integer, nullable=False, default=0)
    total_tests = Column(Integer, nullable=False, default=0)
    execution_time = Column(String, default="8.4ms")
    memory_usage = Column(String, default="14.2 MB")
    earned_xp = Column(Integer, default=350)
    
    # JSON Snapshots matching API_CONTRACT.md response specifications
    skill_update = Column(JSON, nullable=False)
    roadmap_update = Column(JSON, nullable=False)
    readiness_update = Column(JSON, nullable=False)
    
    completed_at = Column(DateTime, default=datetime.datetime.utcnow)
