import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)  # e.g., "usr_948271"
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    avatar = Column(String, default="AC")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")


class LearnerProfile(Base):
    __tablename__ = "learner_profiles"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, unique=True)
    education = Column(String, default="B.S. Computer Science")
    experience_level = Column(String, default="Early Career (1-2 yrs)")
    current_role = Column(String, default="Junior Software Engineer")
    weekly_commitment_hours = Column(Integer, default=12)
    learning_style = Column(String, default="Hands-on Challenges & Code-first")
    streak_days = Column(Integer, default=14)
    total_xp = Column(Integer, default=3450)
    joined_date = Column(String, default="October 2025")
    
    # Active selected career goal
    active_role_id = Column(String, ForeignKey("target_roles.id"), default="mle")
    
    # Calculated dynamic state
    role_readiness = Column(Integer, default=52)
    assessment_completed = Column(Boolean, default=True)
    challenge_completed = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="profile")
    target_role = relationship("TargetRole", foreign_keys=[active_role_id])
    skills = relationship("LearnerSkill", back_populates="profile", cascade="all, delete-orphan")
