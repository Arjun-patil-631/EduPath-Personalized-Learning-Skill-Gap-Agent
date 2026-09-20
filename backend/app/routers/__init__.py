from app.routers.profile import router as profile_router
from app.routers.roles import router as roles_router
from app.routers.skills import router as skills_router
from app.routers.roadmap import router as roadmap_router
from app.routers.recommendations import router as recommendations_router
from app.routers.assessments import router as assessments_router
from app.routers.challenges import router as challenges_router
from app.routers.evaluations import router as evaluations_router
from app.routers.planner import router as planner_router
from app.routers.demo import router as demo_router

__all__ = [
    "profile_router",
    "roles_router",
    "skills_router",
    "roadmap_router",
    "recommendations_router",
    "assessments_router",
    "challenges_router",
    "evaluations_router",
    "planner_router",
    "demo_router",
]

