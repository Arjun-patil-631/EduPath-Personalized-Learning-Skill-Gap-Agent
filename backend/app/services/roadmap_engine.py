from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.roadmap import Roadmap, RoadmapStage, RoadmapNode

def get_roadmap_data(db: Session, user_id: str) -> Dict[str, Any]:
    """
    Fetches the curriculum roadmap DAG for a learner and serializes
    into API_CONTRACT.md format.
    """
    roadmap = db.query(Roadmap).filter(Roadmap.user_id == user_id).first()
    if not roadmap:
        return {}

    stages_list: List[Dict[str, Any]] = []
    for stage in roadmap.stages:
        nodes_list = []
        for node in stage.nodes:
            nodes_list.append({
                "id": node.id,
                "title": node.title,
                "skill": node.skill,
                "status": node.status,
                "score": node.score,
                "duration": node.duration,
                "isAdaptiveInsert": node.is_adaptive_insert,
                "tag": node.tag,
                "description": node.description,
            })

        stages_list.append({
            "id": stage.id,
            "stageNumber": stage.stage_number,
            "name": stage.name,
            "title": stage.name,
            "status": stage.status,
            "nodes": nodes_list,
        })

    return {
        "role": roadmap.role_title,
        "roleTitle": roadmap.role_title,
        "totalModules": roadmap.total_modules,
        "completedModules": roadmap.completed_modules,
        "estimatedWeeks": roadmap.estimated_weeks,
        "activeStage": roadmap.active_stage,
        "isAdaptiveUpdated": roadmap.is_adaptive_updated,
        "stages": stages_list,
    }


def mutate_roadmap_adaptive(
    db: Session,
    user_id: str,
    skill_name: str,
    previous_score: int,
    new_score: int
) -> Dict[str, Any]:
    """
    Performs dynamic curriculum DAG mutation upon challenge completion,
    inserting targeted reinforcement nodes into Stage 1.
    """
    roadmap = db.query(Roadmap).filter(Roadmap.user_id == user_id).first()
    if not roadmap:
        return {}

    roadmap.is_adaptive_updated = True

    # Check if adaptive insert node already exists
    existing_insert = db.query(RoadmapNode).filter(
        RoadmapNode.stage_id == "stage_1",
        RoadmapNode.id == "node_prob_practice"
    ).first()

    if not existing_insert:
        adaptive_node = RoadmapNode(
            id="node_prob_practice",
            stage_id="stage_1",
            node_order=2,
            title="Probability Practice",
            skill="Statistics",
            status="recommended",
            is_adaptive_insert=True,
            tag="Adaptive Insert",
            duration="1 week",
            description="Targeted drill on joint distributions, marginal likelihoods, and Bayesian decision rules."
        )
        db.add(adaptive_node)

    # Update Statistics node with newly evaluated score and shift order
    stats_node = db.query(RoadmapNode).filter(
        RoadmapNode.stage_id == "stage_1",
        RoadmapNode.id == "node_stats"
    ).first()
    if stats_node:
        stats_node.node_order = 3
        stats_node.score = new_score

    db.commit()

    return {
        "title": "ROADMAP UPDATED",
        "previousSequence": ["Statistics", "Machine Learning"],
        "updatedSequence": ["Probability Practice", "Statistics", "Machine Learning"],
        "reasonTitle": "Why the roadmap changed:",
        "reasonExplanation": (
            f"Probability was identified as a critical bottleneck for advanced statistical learning. "
            f"Completing the challenge lifted your {skill_name} baseline from {previous_score}% to {new_score}%. "
            f"The curriculum dynamically inserted 'Probability Practice' as an immediate reinforcement node "
            f"before transitioning to end-to-end Machine Learning pipelines, preventing downstream concept regression."
        )
    }
