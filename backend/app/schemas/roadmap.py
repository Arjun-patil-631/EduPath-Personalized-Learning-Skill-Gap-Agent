from typing import List, Optional
from pydantic import BaseModel

class RoadmapNodeSchema(BaseModel):
    id: str
    title: str
    skill: str
    status: str
    score: Optional[int] = None
    duration: str = "2 weeks"
    isAdaptiveInsert: Optional[bool] = False
    tag: Optional[str] = None
    description: Optional[str] = None

class RoadmapStageSchema(BaseModel):
    id: Optional[str] = None
    stageNumber: Optional[int] = None
    name: Optional[str] = None
    title: Optional[str] = None
    status: str
    nodes: List[RoadmapNodeSchema]

class RoadmapData(BaseModel):
    role: Optional[str] = "Machine Learning Engineer"
    roleTitle: Optional[str] = "Machine Learning Engineer"
    totalModules: int = 14
    completedModules: int = 4
    estimatedWeeks: int = 12
    activeStage: str = "Stage 1"
    isAdaptiveUpdated: bool = False
    stages: List[RoadmapStageSchema]
