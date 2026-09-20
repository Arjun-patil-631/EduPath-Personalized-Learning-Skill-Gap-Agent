from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models.user import LearnerProfile
from app.schemas.common import StandardEnvelope
from app.schemas.skill import SkillGapData
from app.services.skill_gap_engine import calculate_skill_gaps
from app.utils.exceptions import ResourceNotFoundException

router = APIRouter(tags=["Skill Gap Analysis"])

@router.get("/v1/skills/gap-analysis", response_model=StandardEnvelope[SkillGapData])
def get_skill_gap_analysis(db: Session = Depends(get_db)):
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == settings.DEFAULT_USER_ID).first()
    if not profile:
        raise ResourceNotFoundException("Learner profile not found.")

    role = profile.target_role
    if not role:
        raise ResourceNotFoundException("Target role not configured for learner.")

    required_skills = {req.skill_name: req.benchmark_score for req in role.requirements}
    current_skills = {ls.skill_name: ls.score for ls in profile.skills}

    gap_analysis = calculate_skill_gaps(
        current_skills=current_skills,
        required_skills=required_skills,
        role_title=role.title
    )

    # Synchronize calculated readiness to profile
    if profile.role_readiness != gap_analysis["roleReadiness"]:
        profile.role_readiness = gap_analysis["roleReadiness"]
        db.commit()

    return StandardEnvelope(data=SkillGapData(**gap_analysis))
