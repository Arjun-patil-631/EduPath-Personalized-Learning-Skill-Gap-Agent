import json
from sqlalchemy import Column, String, Integer, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class TargetRole(Base):
    __tablename__ = "target_roles"

    id = Column(String, primary_key=True, index=True)  # "mle", "ds", "mlo"
    title = Column(String, nullable=False)
    level = Column(String, default="Mid-Senior Pipeline")
    demand_index = Column(String, default="96/100")
    average_salary = Column(String, default="$162,000")
    department = Column(String, default="Applied AI & Intelligence")
    description = Column(Text, nullable=False)
    key_competencies = Column(JSON, default=list)

    requirements = relationship("RoleSkillRequirement", back_populates="role", cascade="all, delete-orphan")


class RoleSkillRequirement(Base):
    __tablename__ = "role_skill_requirements"

    id = Column(Integer, primary_key=True, autoincrement=True)
    role_id = Column(String, ForeignKey("target_roles.id"), nullable=False)
    skill_name = Column(String, nullable=False)
    benchmark_score = Column(Integer, nullable=False)  # e.g., 85

    role = relationship("TargetRole", back_populates="requirements")
