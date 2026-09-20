from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models.user import LearnerProfile
from app.models.assessment import AssessmentQuestion, AssessmentSubmission
from app.schemas.common import StandardEnvelope
from app.schemas.assessment import (
    AssessmentQuestionSchema,
    AssessmentOptionSchema,
    AssessmentSubmitRequest,
    AssessmentSubmitResponse,
)
from app.utils.exceptions import ResourceNotFoundException

router = APIRouter(tags=["Diagnostic Assessment"])

@router.get("/v1/assessment/questions", response_model=StandardEnvelope[List[AssessmentQuestionSchema]])
def get_assessment_questions(db: Session = Depends(get_db)):
    questions = db.query(AssessmentQuestion).all()
    results = []
    for q in questions:
        opts = [
            AssessmentOptionSchema(
                id=opt.option_key,
                text=opt.text,
                correct=opt.is_correct
            )
            for opt in q.options
        ]
        results.append(AssessmentQuestionSchema(
            id=q.id,
            skill=q.skill,
            title=q.title,
            question=q.question,
            codeSnippet=q.code_snippet,
            options=opts,
            explanation=q.explanation,
        ))
    return StandardEnvelope(data=results)

@router.post("/v1/assessment/submit", response_model=StandardEnvelope[AssessmentSubmitResponse])
def submit_assessment(body: AssessmentSubmitRequest, db: Session = Depends(get_db)):
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == settings.DEFAULT_USER_ID).first()
    if not profile:
        raise ResourceNotFoundException("Learner profile not found.")

    profile.assessment_completed = True
    current_skills = {ls.skill_name: ls.score for ls in profile.skills}

    submission = AssessmentSubmission(
        user_id=profile.user_id,
        answers=body.answers,
        evaluated_scores=current_skills,
        summary="Diagnostic assessment synthesized foundational skill axes into initial baseline vector."
    )
    db.add(submission)
    db.commit()

    return StandardEnvelope(
        data=AssessmentSubmitResponse(
            assessmentCompleted=True,
            evaluatedScores=current_skills,
            summary="Diagnostic assessment synthesized foundational skill axes into initial baseline vector."
        )
    )
