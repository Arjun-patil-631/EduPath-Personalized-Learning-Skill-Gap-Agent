from sqlalchemy import Column, String, Integer, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(String, primary_key=True, index=True)  # e.g., "rdm_mle_usr_948271"
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    role_title = Column(String, nullable=False, default="Machine Learning Engineer")
    total_modules = Column(Integer, default=14)
    completed_modules = Column(Integer, default=4)
    estimated_weeks = Column(Integer, default=12)
    active_stage = Column(String, default="Stage 1")
    is_adaptive_updated = Column(Boolean, default=False)

    stages = relationship("RoadmapStage", back_populates="roadmap", order_by="RoadmapStage.stage_number", cascade="all, delete-orphan")


class RoadmapStage(Base):
    __tablename__ = "roadmap_stages"

    id = Column(String, primary_key=True, index=True)  # e.g., "stage_1"
    roadmap_id = Column(String, ForeignKey("roadmaps.id"), nullable=False)
    stage_number = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    status = Column(String, default="locked")  # "completed", "in_progress", "locked"

    roadmap = relationship("Roadmap", back_populates="stages")
    nodes = relationship("RoadmapNode", back_populates="stage", order_by="RoadmapNode.node_order", cascade="all, delete-orphan")


class RoadmapNode(Base):
    __tablename__ = "roadmap_nodes"

    id = Column(String, primary_key=True, index=True)  # e.g., "node_python", "node_stats"
    stage_id = Column(String, ForeignKey("roadmap_stages.id"), nullable=False)
    node_order = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    skill = Column(String, nullable=False)
    status = Column(String, default="locked")  # "completed", "in_progress", "recommended", "upcoming", "locked"
    score = Column(Integer, nullable=True)
    duration = Column(String, default="2 weeks")
    is_adaptive_insert = Column(Boolean, default=False)
    tag = Column(String, nullable=True)
    description = Column(Text, nullable=True)

    stage = relationship("RoadmapStage", back_populates="nodes")
