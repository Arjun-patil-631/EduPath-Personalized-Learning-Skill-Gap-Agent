from typing import List
from pydantic import BaseModel

class SkillGapItem(BaseModel):
    skill: str
    current: int
    required: int
    gap: int
    deficitPercent: int
    masteryPercentage: int
    urgency: str
    isLargestGap: bool

class SkillGapData(BaseModel):
    roleTitle: str
    roleReadiness: int
    criticalGapsCount: int
    topPriorityGap: str
    gaps: List[SkillGapItem]
