from typing import Optional
from pydantic import BaseModel

class NextBestActionData(BaseModel):
    id: str
    title: str
    module: Optional[str] = "Mathematical Foundations"
    durationMinutes: int = 25
    difficulty: Optional[str] = "Intermediate"
    targetSkill: str
    currentSkillScore: int
    projectedSkillScore: int
    xpAward: int = 350
    why: str
    impactSummary: Optional[str] = None
    isFollowUp: Optional[bool] = False
