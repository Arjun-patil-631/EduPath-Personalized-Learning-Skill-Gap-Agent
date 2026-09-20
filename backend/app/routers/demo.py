from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.services.seed_data import reset_demo_state_in_db
from app.schemas.common import StandardEnvelope

router = APIRouter(tags=["Demo Controls"])

@router.post("/v1/demo/reset", response_model=StandardEnvelope[dict])
def reset_demo(db: Session = Depends(get_db)):
    reset_demo_state_in_db(db, settings.DEFAULT_USER_ID)
    return StandardEnvelope(data={"reset": True, "message": "Demo state reset to baseline successfully."})
