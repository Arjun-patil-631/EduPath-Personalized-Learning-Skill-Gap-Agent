import pytest

def test_get_latest_plan_empty_initially(client):
    res = client.get("/api/v1/planner/plan/latest")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["data"] is None

def test_persist_learning_plan_success(client):
    plan_payload = {
        "plan_title": "Statistics & Bayesian Mastery Plan",
        "reason": "Address critical probability bottleneck before advancing to neural networks.",
        "steps": [
            {
                "skill": "Statistics",
                "topic": "Bayes' Theorem and Conditional Probability",
                "duration_minutes": 120,
                "practice": "Solve 5 conditional probability problems in Python.",
                "evidence": "100% pass on probability unit tests",
                "priority": "high"
            },
            {
                "skill": "Machine Learning",
                "topic": "Naive Bayes Classifier from Scratch",
                "duration_minutes": 90,
                "practice": "Implement GaussianNB using NumPy matrix operations.",
                "evidence": "Classification accuracy >= 90% on benchmark dataset",
                "priority": "medium"
            }
        ]
    }

    res = client.post("/api/v1/planner/plan", json=plan_payload)
    assert res.status_code == 200
    body = res.json()
    assert body["success"] is True
    plan = body["data"]
    assert plan["plan_title"] == "Statistics & Bayesian Mastery Plan"
    assert len(plan["steps"]) == 2
    assert plan["steps"][0]["skill"] == "Statistics"
    assert plan["steps"][0]["priority"] == "high"
    assert plan["steps"][1]["priority"] == "medium"

    # Verify retrieval
    get_res = client.get("/api/v1/planner/plan/latest")
    assert get_res.status_code == 200
    latest = get_res.json()["data"]
    assert latest["id"] == plan["id"]
    assert len(latest["steps"]) == 2

def test_persist_learning_plan_wrapped_n8n_payload(client):
    wrapped_payload = {
        "plan": {
            "plan_title": "Wrapped AI Plan",
            "reason": "Direct delivery from n8n validation node.",
            "steps": [
                {
                    "skill": "Statistics",
                    "topic": "Hypothesis Testing",
                    "duration_minutes": 60,
                    "practice": "Perform two-sample t-test on A/B test data.",
                    "evidence": "Correct p-value computation",
                    "priority": "high"
                }
            ]
        }
    }

    res = client.post("/api/v1/planner/plan", json=wrapped_payload)
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["plan_title"] == "Wrapped AI Plan"
    assert len(data["steps"]) == 1

def test_persist_learning_plan_exceeds_weekly_commitment(client):
    # Default profile weekly commitment is 12 hours = 720 minutes
    overcommitted_payload = {
        "plan_title": "Overambitious Plan",
        "reason": "Exceeds learner capacity.",
        "steps": [
            {
                "skill": "Statistics",
                "topic": "Deep Stat Marathon Part 1",
                "duration_minutes": 400,
                "practice": "Read textbooks",
                "evidence": "Completed",
                "priority": "high"
            },
            {
                "skill": "Statistics",
                "topic": "Deep Stat Marathon Part 2",
                "duration_minutes": 400,
                "practice": "Read textbooks",
                "evidence": "Completed",
                "priority": "high"
            }
        ]
    }

    res = client.post("/api/v1/planner/plan", json=overcommitted_payload)
    assert res.status_code == 422
    error = res.json()["error"]
    assert error["code"] == "VALIDATION_ERROR"
    assert "learner has only 720 minutes available" in error["message"]

def test_persist_learning_plan_step_constraints(client):
    # Empty steps should fail validation (min_length=1)
    res_empty = client.post("/api/v1/planner/plan", json={
        "plan_title": "Empty Plan",
        "reason": "No steps",
        "steps": []
    })
    assert res_empty.status_code == 422

    # More than 3 steps should fail validation (max_length=3)
    res_four = client.post("/api/v1/planner/plan", json={
        "plan_title": "Too Many Steps",
        "reason": "Exceeds 3 steps limit",
        "steps": [
            {"skill": "A", "topic": "T1", "duration_minutes": 30, "practice": "P1", "evidence": "E1", "priority": "low"},
            {"skill": "B", "topic": "T2", "duration_minutes": 30, "practice": "P2", "evidence": "E2", "priority": "low"},
            {"skill": "C", "topic": "T3", "duration_minutes": 30, "practice": "P3", "evidence": "E3", "priority": "low"},
            {"skill": "D", "topic": "T4", "duration_minutes": 30, "practice": "P4", "evidence": "E4", "priority": "low"},
        ]
    })
    assert res_four.status_code == 422

def test_persist_learning_plan_invalid_priority_and_duration(client):
    # Invalid priority
    res_pri = client.post("/api/v1/planner/plan", json={
        "plan_title": "Bad Priority",
        "reason": "Invalid enum",
        "steps": [
            {"skill": "A", "topic": "T1", "duration_minutes": 30, "practice": "P1", "evidence": "E1", "priority": "urgent"}
        ]
    })
    assert res_pri.status_code == 422

    # Negative/Zero duration
    res_dur = client.post("/api/v1/planner/plan", json={
        "plan_title": "Bad Duration",
        "reason": "Negative time",
        "steps": [
            {"skill": "A", "topic": "T1", "duration_minutes": -30, "practice": "P1", "evidence": "E1", "priority": "high"}
        ]
    })
    assert res_dur.status_code == 422

def test_planner_plan_does_not_mutate_learner_state(client):
    # Baseline readiness and skills before
    profile_before = client.get("/api/v1/learner/profile").json()["data"]
    readiness_before = profile_before["roleReadiness"]
    stats_score_before = profile_before["currentSkills"]["Statistics"]

    client.post("/api/v1/planner/plan", json={
        "plan_title": "Pure Planning",
        "reason": "Planning only, no state mutation",
        "steps": [
            {"skill": "Statistics", "topic": "Study", "duration_minutes": 60, "practice": "P", "evidence": "E", "priority": "high"}
        ]
    })

    # Profile after
    profile_after = client.get("/api/v1/learner/profile").json()["data"]
    assert profile_after["roleReadiness"] == readiness_before
    assert profile_after["currentSkills"]["Statistics"] == stats_score_before
