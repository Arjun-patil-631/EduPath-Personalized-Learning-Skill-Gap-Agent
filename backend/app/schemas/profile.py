from typing import Optional, Dict
from pydantic import BaseModel, Field

class ProfileTargetRole(BaseModel):
    id: str
    title: str
    department: Optional[str] = "Applied AI & Intelligence"
    medianSalary: Optional[str] = "$162,000"
    marketDemand: Optional[str] = "High Demand"
    description: Optional[str] = ""

class LearnerProfileData(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    avatar: str = "AC"
    education: str
    experienceLevel: str
    currentRole: str
    weeklyCommitmentHours: int
    learningStyle: str
    streakDays: int
    totalXp: int
    joinedDate: Optional[str] = "October 2025"
    targetRole: ProfileTargetRole
    currentSkills: Dict[str, int]
    roleReadiness: int
    assessmentCompleted: bool = True
    challengeCompleted: bool = False

class ProfileUpdateRequest(BaseModel):
    education: Optional[str] = None
    experienceLevel: Optional[str] = None
    learningStyle: Optional[str] = None
    weeklyCommitmentHours: Optional[int] = Field(None, ge=1, le=60)
    name: Optional[str] = None
