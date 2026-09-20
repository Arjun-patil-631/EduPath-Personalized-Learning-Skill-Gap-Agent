import pytest

def test_submit_ai_evaluation_success_adaptive_loop(client):
    payload = {
        "challengeId": "act_prob_771",
        "score": 100,
        "feedback": "Outstanding implementation of Bayes theorem and conditional distributions.",
        "evidence": "Passed 5 of 5 test vectors with optimal vectorization.",
        "skill": "Statistics"
    }

    res = client.post("/api/v1/evaluations/submit", json=payload)
    assert res.status_code == 200
    body = res.json()
    assert body["success"] is True
    data = body["data"]

    # Verify skill score progression
    assert data["previousSkillScore"] == 42
    assert data["newSkillScore"] == 67
    assert data["skillUpdate"]["delta"] == "+25%"

    # Verify dynamically calculated readiness progression (60% baseline -> 65% after +25 in Stats)
    assert data["previousReadiness"] == 60
    assert data["newReadiness"] == 65
    assert data["readinessDelta"] == "+5%"

    # Verify roadmap mutation
    assert "Probability Practice" in data["roadmapUpdate"]["updatedSequence"]
    assert "Bayes Classifier" in data["roadmapUpdate"]["reasonExplanation"] or "Probability was identified" in data["roadmapUpdate"]["reasonExplanation"]

    # Verify skill gaps were recalculated
    stats_gap = next((g for g in data["skillGaps"] if g["skill"] == "Statistics"), None)
    assert stats_gap is not None
    assert stats_gap["current"] == 67
    assert stats_gap["deficitPercent"] == 8  # 75 required - 67 current = 8 deficit

    # Verify next best action was updated
    assert data["nextBestAction"] is not None
    assert "targetSkill" in data["nextBestAction"]
    assert "title" in data["nextBestAction"]

    # Verify database state
    profile_res = client.get("/api/v1/learner/profile")
    profile = profile_res.json()["data"]
    assert profile["currentSkills"]["Statistics"] == 67
    assert profile["roleReadiness"] == 65

    roadmap_res = client.get("/api/v1/roadmap")
    roadmap = roadmap_res.json()["data"]
    assert roadmap["isAdaptiveUpdated"] is True
    stage1_nodes = roadmap["stages"][0]["nodes"]
    node_ids = [n["id"] for n in stage1_nodes]
    assert "node_prob_practice" in node_ids

def test_submit_ai_evaluation_partial_score(client):
    payload = {
        "challengeId": "act_prob_771",
        "score": 50,
        "feedback": "Partial pass on probability edge cases.",
        "evidence": "Passed basic tests but failed edge cases.",
        "skill": "Statistics"
    }

    res = client.post("/api/v1/evaluations/submit", json=payload)
    assert res.status_code == 200
    data = res.json()["data"]

    # 50% score gives scaled delta of round(25 * 0.5) = 12
    # 42 + 12 = 54
    assert data["previousSkillScore"] == 42
    assert data["newSkillScore"] == 54
    assert data["previousReadiness"] == 60
    assert data["newReadiness"] == 62

def test_submit_ai_evaluation_score_validation(client):
    # Score > 100
    res_high = client.post("/api/v1/evaluations/submit", json={
        "challengeId": "act_prob_771",
        "score": 110,
        "feedback": "Over 100",
        "evidence": "N/A",
        "skill": "Statistics"
    })
    assert res_high.status_code == 422

    # Score < 0
    res_low = client.post("/api/v1/evaluations/submit", json={
        "challengeId": "act_prob_771",
        "score": -10,
        "feedback": "Negative",
        "evidence": "N/A",
        "skill": "Statistics"
    })
    assert res_low.status_code == 422

def test_challenge_evaluate_ai_endpoint(client):
    payload = {
        "challengeId": "act_prob_771",
        "score": 100,
        "feedback": "Agent evaluation passed.",
        "evidence": "All checks validated.",
        "skill": "Statistics"
    }

    res = client.post("/api/v1/challenges/act_prob_771/evaluate-ai", json=payload)
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["newSkillScore"] == 67
    assert data["newReadiness"] == 65

def test_get_evaluation_report_after_ai_evaluation(client):
    # Submit evaluation
    client.post("/api/v1/evaluations/submit", json={
        "challengeId": "act_prob_771",
        "score": 100,
        "feedback": "Success",
        "evidence": "Evidence",
        "skill": "Statistics"
    })

    # Retrieve report
    res = client.get("/api/v1/evaluations/latest")
    assert res.status_code == 200
    eval_data = res.json()["data"]
    assert eval_data["score"] == 100
    assert eval_data["skillUpdate"]["newScore"] == 67
    assert eval_data["readinessUpdate"]["current"] == 65
