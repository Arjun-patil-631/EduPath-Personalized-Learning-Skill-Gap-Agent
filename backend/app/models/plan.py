import datetime
import uuid
from sqlalchemy import Column, String, Integer, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class LearningPlan(Base):
    __tablename__ = "learning_plans"

    id = Column(String, primary_key=True, index=True, default=lambda: f"plan_{uuid.uuid4().hex[:8]}")
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    plan_title = Column(String, nullable=False)
    reason = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    steps = relationship(
        "LearningPlanStep",
        back_populates="plan",
        order_by="LearningPlanStep.step_order",
        cascade="all, delete-orphan",
    )


class LearningPlanStep(Base):
    __tablename__ = "learning_plan_steps"

    id = Column(Integer, primary_key=True, autoincrement=True)
    plan_id = Column(String, ForeignKey("learning_plans.id"), nullable=False, index=True)
    step_order = Column(Integer, nullable=False, default=1)
    skill = Column(String, nullable=False)
    topic = Column(String, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    practice = Column(Text, nullable=False)
    evidence = Column(Text, nullable=False)
    priority = Column(String, nullable=False, default="medium")  # "high", "medium", "low"

    plan = relationship("LearningPlan", back_populates="steps")
