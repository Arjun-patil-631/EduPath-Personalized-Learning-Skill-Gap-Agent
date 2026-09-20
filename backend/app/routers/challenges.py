import time
import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models.user import LearnerProfile
from app.models.challenge import Challenge
from app.models.skill import LearnerSkill
from app.models.evaluation import EvaluationRecord
from app.models.progress import ActivityLog
from app.schemas.common import StandardEnvelope
from app.schemas.challenge import (
    ChallengeDetailData,
    TestCaseSchema,
    ChallengeEvaluateRequest,
    EvaluationResultData,
    SkillUpdateDetail,
    RoadmapUpdateDetail,
    ReadinessUpdateDetail,
)
from app.services.evaluation_sandbox import evaluate_code_solution
from app.services.readiness_engine import calculate_role_readiness
from app.services.roadmap_engine import mutate_roadmap_adaptive
from app.utils.exceptions import ResourceNotFoundException

router = APIRouter(tags=["Challenges"])

@router.get("/v1/challenges/{challengeId}", response_model=StandardEnvelope[ChallengeDetailData])
def get_challenge(challengeId: str, db: Session = Depends(get_db)):
    challenge = db.query(Challenge).filter(Challenge.id == challengeId).first()
    if not challenge:
        raise ResourceNotFoundException(f"Challenge '{challengeId}' not found.")

    test_cases_data = [
        TestCaseSchema(
            id=tc.case_key,
            name=tc.name,
            input=tc.input_repr,
            expectedOutput=tc.expected_output,
            status="passed",
            latency=tc.latency,
        )
        for tc in challenge.test_cases
    ]

    return StandardEnvelope(
        data=ChallengeDetailData(
            id=challenge.id,
            title=challenge.title,
            durationMinutes=challenge.duration_minutes,
            difficulty=challenge.difficulty,
            estimatedTime=challenge.estimated_time,
            category=challenge.category,
            scenario=challenge.scenario,
            instructions=challenge.instructions or [],
            starterCode=challenge.starter_code,
            testCases=test_cases_data,
        )
    )

@router.post("/v1/challenges/{challengeId}/evaluate", response_model=StandardEnvelope[EvaluationResultData])
def evaluate_challenge(
    challengeId: str,
    body: ChallengeEvaluateRequest,
    db: Session = Depends(get_db)
):
    challenge = db.query(Challenge).filter(Challenge.id == challengeId).first()
    if not challenge:
        raise ResourceNotFoundException(f"Challenge '{challengeId}' not found.")

    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == settings.DEFAULT_USER_ID).first()
    if not profile:
        raise ResourceNotFoundException("Learner profile not found.")

    # Execute solution through Python evaluation sandbox
    eval_metrics = evaluate_code_solution(
        code=body.code,
        test_cases=challenge.test_cases,
        max_gain=challenge.max_gain,
        xp_award=challenge.xp_award
    )

    # 1. Update target skill score dynamically
    target_skill_name = challenge.target_skill
    skill_entry = db.query(LearnerSkill).filter(
        LearnerSkill.learner_profile_id == profile.id,
        LearnerSkill.skill_name == target_skill_name
    ).first()

    previous_skill_score = skill_entry.score if skill_entry else 40
    new_skill_score = min(100, previous_skill_score + eval_metrics["deltaPoints"])
    if skill_entry:
        skill_entry.score = new_skill_score

    # 2. Update Learner XP and challenge state
    profile.total_xp += eval_metrics["earnedXp"]
    profile.challenge_completed = True

    # 3. Recalculate Role Readiness dynamically from updated skill vector
    previous_readiness = profile.role_readiness
    current_skills = {ls.skill_name: ls.score for ls in profile.skills}
    required_skills = {req.skill_name: req.benchmark_score for req in profile.target_role.requirements}
    new_readiness = calculate_role_readiness(current_skills, required_skills)
    profile.role_readiness = new_readiness

    readiness_delta = new_readiness - previous_readiness
    readiness_delta_str = f"+{readiness_delta}%" if readiness_delta >= 0 else f"{readiness_delta}%"

    # 4. Perform adaptive roadmap mutation
    roadmap_update = mutate_roadmap_adaptive(
        db=db,
        user_id=profile.user_id,
        skill_name=target_skill_name,
        previous_score=previous_skill_score,
        new_score=new_skill_score
    )

    skill_delta_str = f"+{eval_metrics['deltaPoints']}%" if eval_metrics['deltaPoints'] >= 0 else f"{eval_metrics['deltaPoints']}%"
    status_label = "Significant Mastery Gain" if eval_metrics["deltaPoints"] >= 20 else "Milestone Progress"

    skill_update_detail = SkillUpdateDetail(
        skillName=target_skill_name,
        previousScore=previous_skill_score,
        newScore=new_skill_score,
        delta=skill_delta_str,
        status=status_label,
    )

    roadmap_update_detail = RoadmapUpdateDetail(
        title=roadmap_update.get("title", "ROADMAP UPDATED"),
        previousSequence=roadmap_update.get("previousSequence", ["Statistics", "Machine Learning"]),
        updatedSequence=roadmap_update.get("updatedSequence", ["Probability Practice", "Statistics", "Machine Learning"]),
        reasonTitle=roadmap_update.get("reasonTitle", "Why the roadmap changed:"),
        reasonExplanation=roadmap_update.get("reasonExplanation", ""),
    )

    readiness_update_detail = ReadinessUpdateDetail(
        previous=previous_readiness,
        current=new_readiness,
        delta=readiness_delta_str,
    )

    # 5. Persist evaluation record
    eval_record = EvaluationRecord(
        id=f"eval_{challengeId}_{uuid.uuid4().hex[:8]}",
        user_id=profile.user_id,
        challenge_id=challenge.id,
        challenge_title=challenge.title,
        score=eval_metrics["score"],
        tests_passed=eval_metrics["testsPassed"],
        total_tests=eval_metrics["totalTests"],
        execution_time=eval_metrics["executionTime"],
        memory_usage=eval_metrics["memoryUsage"],
        earned_xp=eval_metrics["earnedXp"],
        skill_update=skill_update_detail.model_dump(),
        roadmap_update=roadmap_update_detail.model_dump(),
        readiness_update=readiness_update_detail.model_dump(),
    )
    db.add(eval_record)

    # 6. Add to Activity Log
    db.add(ActivityLog(
        id=f"act_{uuid.uuid4().hex[:8]}",
        user_id=profile.user_id,
        title=f"{challenge.title} Completed",
        skill=target_skill_name,
        delta=f"{skill_delta_str} ({previous_skill_score}% → {new_skill_score}%)",
        timestamp_str="Just now",
        activity_type="challenge",
        is_highlight=True,
    ))

    db.commit()

    return StandardEnvelope(
        data=EvaluationResultData(
            challengeId=challenge.id,
            challengeTitle=challenge.title,
            score=eval_metrics["score"],
            testsPassed=eval_metrics["testsPassed"],
            totalTests=eval_metrics["totalTests"],
            executionTime=eval_metrics["executionTime"],
            memoryUsage=eval_metrics["memoryUsage"],
            completedAt="Just now",
            skillUpdate=skill_update_detail,
            roadmapUpdate=roadmap_update_detail,
            readinessUpdate=readiness_update_detail,
            earnedXp=eval_metrics["earnedXp"],
        )
    )
