from typing import List, Dict, Optional
from pydantic import BaseModel

class AssessmentOptionSchema(BaseModel):
    id: str
    text: str
    correct: Optional[bool] = None

class AssessmentQuestionSchema(BaseModel):
    id: str
    skill: str
    title: str
    question: str
    codeSnippet: Optional[str] = None
    options: List[AssessmentOptionSchema]
    explanation: Optional[str] = None

class AssessmentSubmitRequest(BaseModel):
    answers: Dict[str, str]

class AssessmentSubmitResponse(BaseModel):
    assessmentCompleted: bool = True
    evaluatedScores: Dict[str, int]
    summary: str
