from typing import List, Optional, Any, Dict
from pydantic import BaseModel

class TestCaseSchema(BaseModel):
    id: str
    name: str
    input: str
    expectedOutput: str
    status: Optional[str] = "passed"
    latency: Optional[str] = "1.0ms"

class ChallengeDetailData(BaseModel):
    id: str
    title: str
    durationMinutes: int = 25
    difficulty: str = "Intermediate"
    estimatedTime: Optional[str] = "25 min"
    category: str
    scenario: str
    instructions: List[str]
    starterCode: str
    testCases: List[TestCaseSchema]

class ChallengeEvaluateRequest(BaseModel):
    code: str

class SkillUpdateDetail(BaseModel):
    skillName: str
    previousScore: int
    newScore: int
    delta: str
    status: Optional[str] = None

class RoadmapUpdateDetail(BaseModel):
    title: str = "ROADMAP UPDATED"
    previousSequence: List[str]
    updatedSequence: List[str]
    reasonTitle: str = "Why the roadmap changed:"
    reasonExplanation: str

class ReadinessUpdateDetail(BaseModel):
    previous: int
    current: int
    delta: str

class EvaluationResultData(BaseModel):
    challengeId: str
    challengeTitle: str
    score: int
    testsPassed: int
    totalTests: int
    executionTime: str
    memoryUsage: str
    completedAt: Optional[str] = "Just now"
    skillUpdate: SkillUpdateDetail
    roadmapUpdate: RoadmapUpdateDetail
    readinessUpdate: ReadinessUpdateDetail
    earnedXp: int
