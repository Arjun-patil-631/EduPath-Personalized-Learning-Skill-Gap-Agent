from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models.user import LearnerProfile
from app.models.role import TargetRole
from app.schemas.common import StandardEnvelope
from app.schemas.role import TargetRoleSchema, SetTargetRoleRequest
from app.schemas.profile import LearnerProfileData
from app.routers.profile import _build_profile_response
from app.services.readiness_engine import calculate_role_readiness
from app.utils.exceptions import ResourceNotFoundException

router = APIRouter(tags=["Target Roles"])

@router.get("/v1/roles", response_model=StandardEnvelope[List[TargetRoleSchema]])
def get_target_roles(db: Session = Depends(get_db)):
    roles = db.query(TargetRole).all()
    data = []
    for r in roles:
        reqs = {req.skill_name: req.benchmark_score for req in r.requirements}
        data.append(TargetRoleSchema(
            id=r.id,
            title=r.title,
            level=r.level,
            demandIndex=r.demand_index,
            averageSalary=r.average_salary,
            description=r.description,
            requiredSkills=reqs,
            keyCompetencies=r.key_competencies or [],
        ))
    return StandardEnvelope(data=data)

@router.put("/v1/learner/target-role", response_model=StandardEnvelope[LearnerProfileData])
def set_target_role(body: SetTargetRoleRequest, db: Session = Depends(get_db)):
    role = db.query(TargetRole).filter(TargetRole.id == body.roleId).first()
    if not role:
        raise ResourceNotFoundException(f"Target role '{body.roleId}' not recognized.")

    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == settings.DEFAULT_USER_ID).first()
    if not profile:
        raise ResourceNotFoundException("Learner profile not found.")

    profile.active_role_id = role.id

    # Recalculate dynamic readiness for the new target role
    required_skills = {req.skill_name: req.benchmark_score for req in role.requirements}
    current_skills = {ls.skill_name: ls.score for ls in profile.skills}
    profile.role_readiness = calculate_role_readiness(current_skills, required_skills)

    db.commit()
    db.refresh(profile)
    return StandardEnvelope(data=_build_profile_response(profile))
