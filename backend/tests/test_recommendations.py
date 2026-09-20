def test_get_next_best_action_advancement(client):
    # Before probability challenge: Next Best Action should be act_prob_771
    # First reset demo state to be certain
    client.post("/api/v1/demo/reset")
    res1 = client.get("/api/v1/recommendations/next-best-action")
    assert res1.status_code == 200
    action1 = res1.json()["data"]
    assert action1["id"] == "act_prob_771"
    assert action1["targetSkill"] == "Statistics"
    assert action1["isFollowUp"] is False

    # Complete the probability challenge
    valid_code = """
import numpy as np

def compute_posterior(prior: float, sensitivity: float, false_positive_rate: float) -> float:
    p_signal = (prior * sensitivity) + ((1.0 - prior) * false_positive_rate)
    if p_signal == 0:
        return 0.0
    posterior = (prior * sensitivity) / p_signal
    return float(np.round(posterior, 4))

def evaluate_decision(posterior: float, threshold: float = 0.35) -> dict:
    is_anomaly = posterior >= threshold
    return {
        "posterior_probability": posterior,
        "trigger_alert": is_anomaly,
        "confidence_delta": float(np.round(posterior - threshold, 4))
    }
"""
    eval_res = client.post("/api/v1/challenges/act_prob_771/evaluate", json={"code": valid_code})
    assert eval_res.status_code == 200

    # Next Best Action should now automatically advance to SGD Lab
    res2 = client.get("/api/v1/recommendations/next-best-action")
    assert res2.status_code == 200
    action2 = res2.json()["data"]
    assert action2["id"] == "act_ml_loss_882"
    assert action2["targetSkill"] == "Machine Learning"
    assert action2["isFollowUp"] is True
    assert "With Statistics reinforced" in action2["why"]
