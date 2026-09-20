from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.models.user import LearnerProfile
from app.schemas.common import StandardEnvelope
from app.schemas.recommendation import NextBestActionData
from app.services.recommendation_engine import get_next_best_action
from app.utils.exceptions import ResourceNotFoundException

router = APIRouter(tags=["Recommendations"])

@router.get("/v1/recommendations/next-best-action", response_model=StandardEnvelope[NextBestActionData])
def get_recommendation_action(db: Session = Depends(get_db)):
    profile = db.query(LearnerProfile).filter(LearnerProfile.user_id == settings.DEFAULT_USER_ID).first()
    if not profile:
        raise ResourceNotFoundException("Learner profile not found.")

    current_skills = {ls.skill_name: ls.score for ls in profile.skills}
    action = get_next_best_action(current_skills, profile.challenge_completed)
    return StandardEnvelope(data=NextBestActionData(**action))
