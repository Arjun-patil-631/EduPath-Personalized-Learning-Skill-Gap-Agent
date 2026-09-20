from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models.evaluation import EvaluationRecord
from app.schemas.common import StandardEnvelope
from app.schemas.challenge import (
    EvaluationResultData,
    SkillUpdateDetail,
    RoadmapUpdateDetail,
    ReadinessUpdateDetail,
)
from app.schemas.evaluation import AIEvaluationSubmitRequest, AdaptationData
from app.services.adaptation_engine import trigger_adaptation
from app.utils.exceptions import ResourceNotFoundException

router = APIRouter(tags=["Evaluations"])

@router.post("/v1/evaluations/submit", response_model=StandardEnvelope[AdaptationData])
def submit_ai_evaluation(
    body: AIEvaluationSubmitRequest,
    db: Session = Depends(get_db)
):
    """
    Validates structured evaluation from the Evaluation Agent / n8n and triggers
    the authoritative deterministic adaptive loop:
    1. Updates skill score based on verified score
    2. Recalculates role readiness
    3. Mutates roadmap DAG
    4. Computes changed skill gaps & new next-best-action
    5. Persists evaluation record and activity log
    """
    challenge_id = body.challengeId or "act_prob_771"
    adaptation_result = trigger_adaptation(
        db=db,
        user_id=settings.DEFAULT_USER_ID,
        challenge_id=challenge_id,
        score=body.score,
        feedback=body.feedback,
        evidence=body.evidence,
        skill_name=body.skill,
    )
    return StandardEnvelope(data=AdaptationData(**adaptation_result))

@router.get("/v1/evaluations/{evaluationId}", response_model=StandardEnvelope[EvaluationResultData])
@router.get("/v1/evaluations", response_model=StandardEnvelope[EvaluationResultData])
def get_evaluation_report(evaluationId: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(EvaluationRecord).filter(EvaluationRecord.user_id == settings.DEFAULT_USER_ID)
    if evaluationId and evaluationId not in ("latest", "undefined"):
        record = query.filter(EvaluationRecord.id == evaluationId).first()
    else:
        record = query.order_by(EvaluationRecord.completed_at.desc()).first()

    if not record:
        # Fallback default baseline evaluation if accessed before first challenge run
        default_data = EvaluationResultData(
            challengeId="act_prob_771",
            challengeTitle="Probability Challenge: Bayes Classifier & Conditional Expectation",
            score=100,
            testsPassed=5,
            totalTests=5,
            executionTime="8.4ms",
            memoryUsage="14.2 MB",
            completedAt="Just now",
            skillUpdate=SkillUpdateDetail(
                skillName="Statistics",
                previousScore=42,
                newScore=67,
                delta="+25%",
                status="Significant Mastery Gain"
            ),
            roadmapUpdate=RoadmapUpdateDetail(
                title="ROADMAP UPDATED",
                previousSequence=["Statistics", "Machine Learning"],
                updatedSequence=["Probability Practice", "Statistics", "Machine Learning"],
                reasonTitle="Why the roadmap changed:",
                reasonExplanation="Probability was identified as a critical bottleneck for advanced statistical learning. Completing the challenge lifted your Statistics baseline from 42% to 67%."
            ),
            readinessUpdate=ReadinessUpdateDetail(
                previous=52,
                current=59,
                delta="+7%"
            ),
            earnedXp=350
        )
        return StandardEnvelope(data=default_data)

    return StandardEnvelope(
        data=EvaluationResultData(
            challengeId=record.challenge_id,
            challengeTitle=record.challenge_title,
            score=record.score,
            testsPassed=record.tests_passed,
            totalTests=record.total_tests,
            executionTime=record.execution_time,
            memoryUsage=record.memory_usage,
            completedAt="Just now",
            skillUpdate=SkillUpdateDetail(**record.skill_update),
            roadmapUpdate=RoadmapUpdateDetail(**record.roadmap_update),
            readinessUpdate=ReadinessUpdateDetail(**record.readiness_update),
            earnedXp=record.earned_xp,
        )
    )
