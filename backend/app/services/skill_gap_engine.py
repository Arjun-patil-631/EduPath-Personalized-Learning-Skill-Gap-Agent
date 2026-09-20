from typing import Dict, List, Any
from app.services.readiness_engine import calculate_role_readiness

def calculate_skill_gaps(
    current_skills: Dict[str, int],
    required_skills: Dict[str, int],
    role_title: str
) -> Dict[str, Any]:
    """
    Computes competency gap analysis comparing current learner skill scores
    against the target role benchmarks.
    """
    gaps: List[Dict[str, Any]] = []

    for skill_name, required in required_skills.items():
        current = current_skills.get(skill_name, 0)
        gap = current - required
        deficit = max(0, required - current)
        mastery = min(100, round((current / required) * 100)) if required > 0 else 100

        if deficit >= 30:
            urgency = "critical"
        elif deficit >= 15:
            urgency = "moderate"
        elif deficit > 0:
            urgency = "minor"
        else:
            urgency = "aligned"

        gaps.append({
            "skill": skill_name,
            "current": current,
            "required": required,
            "gap": gap,
            "deficitPercent": deficit,
            "masteryPercentage": mastery,
            "urgency": urgency,
            "isLargestGap": False,
        })

    # Sort with largest deficit first (most negative gap)
    gaps.sort(key=lambda item: item["gap"])

    # Determine largest gap and top priority blocker
    top_priority_gap = "None"
    if gaps and gaps[0]["deficitPercent"] > 0:
        gaps[0]["isLargestGap"] = True
        top_priority_gap = gaps[0]["skill"]

    critical_count = sum(1 for g in gaps if g["urgency"] == "critical")
    role_readiness = calculate_role_readiness(current_skills, required_skills)

    return {
        "roleTitle": role_title,
        "roleReadiness": role_readiness,
        "criticalGapsCount": critical_count,
        "topPriorityGap": top_priority_gap,
        "gaps": gaps,
    }
