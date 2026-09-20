from typing import List, Literal, Optional
from pydantic import BaseModel, Field

class PlanStepCreate(BaseModel):
    skill: str = Field(..., min_length=1)
    topic: str = Field(..., min_length=1)
    duration_minutes: int = Field(..., gt=0, description="Duration in minutes, must be a positive integer")
    practice: str = Field(..., min_length=1)
    evidence: str = Field(..., min_length=1)
    priority: Literal["high", "medium", "low"]

class PlanCreate(BaseModel):
    plan_title: str = Field(..., min_length=1)
    reason: str = Field(..., min_length=1)
    steps: List[PlanStepCreate] = Field(..., min_length=1, max_length=3)

class PlanStepResponse(BaseModel):
    id: int
    skill: str
    topic: str
    duration_minutes: int
    practice: str
    evidence: str
    priority: str

class PlanResponse(BaseModel):
    id: str
    user_id: str
    plan_title: str
    reason: str
    created_at: Optional[str] = None
    steps: List[PlanStepResponse]
