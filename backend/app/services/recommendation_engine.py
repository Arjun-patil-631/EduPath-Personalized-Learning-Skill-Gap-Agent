from typing import Dict, Any

def get_next_best_action(
    current_skills: Dict[str, int],
    challenge_completed: bool = False
) -> Dict[str, Any]:
    """
    Computes the highest leverage Next Best Action based on learner's current
    measured competencies and completed challenges.
    """
    stats_score = current_skills.get("Statistics", 42)
    ml_score = current_skills.get("Machine Learning", 55)

    # If Statistics has been reinforced (>= 65) or probability challenge was completed:
    if challenge_completed or stats_score >= 65:
        projected_ml = min(100, ml_score + 17)
        return {
            "id": "act_ml_loss_882",
            "title": "Loss Function Derivatives & SGD Lab",
            "module": "Core Machine Learning",
            "durationMinutes": 30,
            "difficulty": "Intermediate",
            "targetSkill": "Machine Learning",
            "currentSkillScore": ml_score,
            "projectedSkillScore": projected_ml,
            "xpAward": 400,
            "why": f"With Statistics reinforced to {stats_score}%, you now have the required foundation to derive loss gradients without conceptual regressions.",
            "impactSummary": "Unlocks Milestone 2: Neural Gradient Solvers.",
            "isFollowUp": True,
        }

    # Baseline action addressing primary mathematical bottleneck
    projected_stats = min(100, stats_score + 25)
    return {
        "id": "act_prob_771",
        "title": "Probability Challenge",
        "module": "Statistical Inference & Bayesian Estimation",
        "durationMinutes": 25,
        "difficulty": "Intermediate",
        "targetSkill": "Statistics",
        "currentSkillScore": stats_score,
        "projectedSkillScore": projected_stats,
        "xpAward": 350,
        "why": "Probability is currently one of the learner's largest skill gaps for the selected role.",
        "impactSummary": "Closing this gap eliminates the prerequisite blocker for Advanced Machine Learning & Loss Function Formulations.",
        "isFollowUp": False,
    }
