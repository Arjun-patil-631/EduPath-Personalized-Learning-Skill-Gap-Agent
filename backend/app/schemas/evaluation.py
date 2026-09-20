from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.challenge import SkillUpdateDetail, RoadmapUpdateDetail, ReadinessUpdateDetail
from app.schemas.skill import SkillGapItem
from app.schemas.recommendation import NextBestActionData

class AIEvaluationSubmitRequest(BaseModel):
    challengeId: Optional[str] = "act_prob_771"
    score: float = Field(..., ge=0, le=100, description="Evaluation score between 0 and 100")
    feedback: str = Field(..., min_length=1, description="Structured feedback from evaluation agent")
    evidence: str = Field(..., min_length=1, description="Demonstrated evidence evaluation")
    skill: str = Field(..., min_length=1, description="Target skill axis evaluated")

class AdaptationData(BaseModel):
    challengeId: str
    challengeTitle: str
    score: int
    feedback: str
    evidence: str
    skill: str
    previousSkillScore: int
    newSkillScore: int
    previousReadiness: int
    newReadiness: int
    readinessDelta: str
    skillUpdate: SkillUpdateDetail
    roadmapUpdate: RoadmapUpdateDetail
    readinessUpdate: ReadinessUpdateDetail
    skillGaps: List[SkillGapItem]
    nextBestAction: NextBestActionData
    earnedXp: int
