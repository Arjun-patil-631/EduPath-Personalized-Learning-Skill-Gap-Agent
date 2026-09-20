import datetime
from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base

class Skill(Base):
    __tablename__ = "skills"

    name = Column(String, primary_key=True, index=True)  # "Python", "SQL", "Statistics", etc.
    category = Column(String, default="Engineering")
    description = Column(String, nullable=True)


class LearnerSkill(Base):
    __tablename__ = "learner_skills"

    id = Column(Integer, primary_key=True, autoincrement=True)
    learner_profile_id = Column(String, ForeignKey("learner_profiles.id"), nullable=False)
    skill_name = Column(String, nullable=False)
    score = Column(Integer, nullable=False, default=0)  # 0 to 100
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    profile = relationship("LearnerProfile", back_populates="skills")
