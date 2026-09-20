from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.schemas.common import StandardEnvelope
from app.schemas.roadmap import RoadmapData
from app.services.roadmap_engine import get_roadmap_data
from app.utils.exceptions import ResourceNotFoundException

router = APIRouter(tags=["Curriculum Roadmap"])

@router.get("/v1/roadmap", response_model=StandardEnvelope[RoadmapData])
def get_curriculum_roadmap(db: Session = Depends(get_db)):
    roadmap_data = get_roadmap_data(db, settings.DEFAULT_USER_ID)
    if not roadmap_data:
        raise ResourceNotFoundException("Roadmap curriculum not found for learner.")
    return StandardEnvelope(data=RoadmapData(**roadmap_data))
