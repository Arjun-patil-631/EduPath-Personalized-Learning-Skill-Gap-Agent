from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models.user import User, LearnerProfile
from app.schemas.common import StandardEnvelope
from app.schemas.profile import LearnerProfileData, ProfileUpdateRequest, ProfileTargetRole
from app.services.readiness_engine import calculate_role_readiness
from app.utils.exceptions import ResourceNotFoundException, ValidationException

router = APIRouter(tags=["Learner Profile"])

def _build_profile_response(profile: LearnerProfile) -> LearnerProfileData:
    user = profile.user
    role = profile.target_role

    current_skills = {ls.skill_name: ls.score for ls in profile.skills}
    required_skills = {
        requirement.skill_name: requirement.benchmark_score
        for requirement in role.requirements
    } if role else {}
    role_readiness = calculate_role_readiness(current_skills, required_skills)

    target_role_data = ProfileTargetRole(
        id=role.id if role else "mle",
        title=role.title if role else "Machine Learning Engineer",
        department=role.department if role else "Applied AI & Intelligence",
        medianSalary=role.average_salary if role else "$162,000",
        marketDemand=f"Demand {role.demand_index}" if role else "High Demand",
        description=role.description if role else "",
    )

    return LearnerProfileData(
        id=user.id,
        name=user.name,
        email=user.email,
        avatar=user.avatar or "AC",
        education=profile.education,
        experienceLevel=profile.experience_level,
        currentRole=profile.current_role,
        weeklyCommitmentHours=profile.weekly_commitment_hours,
        learningStyle=profile.learning_style,
        streakDays=profile.streak_days,
        totalXp=profile.total_xp,
        joinedDate=profile.joined_date,
        targetRole=target_role_data,
        currentSkills=current_skills,
        roleReadiness=role_readiness,
        assessmentCompleted=profile.assessment_completed,
        challengeCompleted=profile.challenge_completed,
    )

@router.get("/v1/learner/profile", response_model=StandardEnvelope[LearnerProfileData])
def get_learner_profile(db: Session = Depends(get_db)):
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == settings.DEFAULT_USER_ID).first()
    if not profile:
        raise ResourceNotFoundException("Learner profile not found.")
    return StandardEnvelope(data=_build_profile_response(profile))

@router.put("/v1/learner/profile", response_model=StandardEnvelope[LearnerProfileData])
def update_learner_profile(updates: ProfileUpdateRequest, db: Session = Depends(get_db)):
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == settings.DEFAULT_USER_ID).first()
    if not profile:
        raise ResourceNotFoundException("Learner profile not found.")

    if updates.weeklyCommitmentHours is not None:
        if updates.weeklyCommitmentHours < 1 or updates.weeklyCommitmentHours > 60:
            raise ValidationException("Weekly commitment hours must be between 1 and 60.")
        profile.weekly_commitment_hours = updates.weeklyCommitmentHours

    if updates.education is not None:
        profile.education = updates.education
    if updates.experienceLevel is not None:
        profile.experience_level = updates.experienceLevel
    if updates.learningStyle is not None:
        profile.learning_style = updates.learningStyle
    if updates.name is not None and profile.user:
        profile.user.name = updates.name

    db.commit()
    db.refresh(profile)
    return StandardEnvelope(data=_build_profile_response(profile))
