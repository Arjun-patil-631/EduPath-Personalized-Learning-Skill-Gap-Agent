def test_get_challenge_detail(client):
    res = client.get("/api/v1/challenges/act_prob_771")
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["id"] == "act_prob_771"
    assert "Bayes Classifier" in data["title"]
    assert len(data["testCases"]) == 5
    assert len(data["instructions"]) >= 1

def test_evaluate_challenge_syntax_error(client):
    payload = {"code": "def broken_code(: print('syntax error')"}
    res = client.post("/api/v1/challenges/act_prob_771/evaluate", json=payload)
    assert res.status_code == 400
    data = res.json()
    assert data["success"] is False
    assert data["error"]["code"] == "PYTHON_SYNTAX_ERROR"

def test_evaluate_challenge_success_and_adaptive_loop(client):
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
    res = client.post("/api/v1/challenges/act_prob_771/evaluate", json={"code": valid_code})
    assert res.status_code == 200
    eval_data = res.json()["data"]
    
    assert eval_data["score"] == 100
    assert eval_data["testsPassed"] == 5
    assert eval_data["totalTests"] == 5
    assert eval_data["earnedXp"] == 350
    
    # Verify dynamic skill update
    skill_update = eval_data["skillUpdate"]
    assert skill_update["skillName"] == "Statistics"
    assert skill_update["previousScore"] == 42
    assert skill_update["newScore"] == 67
    assert skill_update["delta"] == "+25%"
    
    # Verify adaptive roadmap update payload
    roadmap_update = eval_data["roadmapUpdate"]
    assert roadmap_update["title"] == "ROADMAP UPDATED"
    assert "Probability Practice" in roadmap_update["updatedSequence"]
    
    # Verify roadmap DAG reflects mutation
    rm_res = client.get("/api/v1/roadmap")
    rm_data = rm_res.json()["data"]
    assert rm_data["isAdaptiveUpdated"] is True
    
    stage_1_nodes = rm_data["stages"][0]["nodes"]
    node_ids = [n["id"] for n in stage_1_nodes]
    assert "node_prob_practice" in node_ids
    
    prob_node = next(n for n in stage_1_nodes if n["id"] == "node_prob_practice")
    assert prob_node["isAdaptiveInsert"] is True
    assert prob_node["status"] == "recommended"

    # Verify GET /api/v1/evaluations returns the latest evaluation
    eval_get_res = client.get("/api/v1/evaluations/latest")
    assert eval_get_res.status_code == 200
    assert eval_get_res.json()["data"]["challengeId"] == "act_prob_771"

def test_evaluate_challenge_partial_failure_calculates_scaled_delta(client):
    # Code that implements compute_posterior but evaluate_decision always returns false (fails test cases 2 and 4)
    partial_code = """
import numpy as np

def compute_posterior(prior: float, sensitivity: float, false_positive_rate: float) -> float:
    p_signal = (prior * sensitivity) + ((1.0 - prior) * false_positive_rate)
    if p_signal == 0:
        return 0.0
    posterior = (prior * sensitivity) / p_signal
    return float(np.round(posterior, 4))

def evaluate_decision(posterior: float, threshold: float = 0.35) -> dict:
    return {
        "posterior_probability": posterior,
        "trigger_alert": False,
        "confidence_delta": 0.0
    }
"""
    res = client.post("/api/v1/challenges/act_prob_771/evaluate", json={"code": partial_code})
    assert res.status_code == 200
    eval_data = res.json()["data"]

    # 3 of 5 tests pass (tc_1, tc_3, tc_5 pass; tc_2 and tc_4 fail trigger_alert is True)
    assert eval_data["testsPassed"] == 3
    assert eval_data["totalTests"] == 5
    assert eval_data["score"] == 60  # 3/5 = 60%
    
    # Delta should be round(25 * 0.6) = 15 points (NOT 25 points!)
    # Proves results are dynamically calculated, NOT hard-coded!
    skill_update = eval_data["skillUpdate"]
    assert skill_update["newScore"] == 42 + 15  # 57%
    assert skill_update["delta"] == "+15%"

