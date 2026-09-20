def test_get_learner_profile(client):
    res = client.get("/api/v1/learner/profile")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    profile = data["data"]
    assert profile["id"] == "usr_948271"
    assert profile["name"] == "Alex Chen"
    assert profile["targetRole"]["id"] == "mle"
    assert "Statistics" in profile["currentSkills"]
    assert profile["currentSkills"]["Statistics"] == 42
    assert profile["streakDays"] == 14

def test_update_learner_profile(client):
    payload = {
        "education": "M.S. Artificial Intelligence",
        "weeklyCommitmentHours": 18,
        "experienceLevel": "Mid Career (3+ yrs)"
    }
    res = client.put("/api/v1/learner/profile", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    profile = data["data"]
    assert profile["education"] == "M.S. Artificial Intelligence"
    assert profile["weeklyCommitmentHours"] == 18
    assert profile["experienceLevel"] == "Mid Career (3+ yrs)"

def test_update_learner_profile_invalid_hours(client):
    payload = {"weeklyCommitmentHours": 99}
    res = client.put("/api/v1/learner/profile", json=payload)
    assert res.status_code == 422
    data = res.json()
    assert data["success"] is False
    assert data["error"]["code"] == "VALIDATION_ERROR"
