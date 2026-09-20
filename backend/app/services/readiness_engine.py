from typing import Dict

def calculate_role_readiness(
    current_skills: Dict[str, int],
    required_skills: Dict[str, int]
) -> int:
    """
    Computes overall role readiness as a percentage (0 - 100) based on
    the learner's current evaluated skills vs target role benchmark requirements.
    
    Formula:
        Readiness = (sum(min(required_i, current_i)) / sum(required_i)) * 100
    """
    if not required_skills:
        return 0

    total_required = sum(required_skills.values())
    if total_required == 0:
        return 0

    total_current = sum(
        min(required_skills[skill], current_skills.get(skill, 0))
        for skill in required_skills
    )

    readiness = round((total_current / total_required) * 100)
    return max(0, min(100, readiness))
