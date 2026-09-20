def test_get_skill_gap_analysis(client):
    res = client.get("/api/v1/skills/gap-analysis")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    gap_data = data["data"]
    assert gap_data["roleTitle"] == "Machine Learning Engineer"
    assert len(gap_data["gaps"]) == 6

    # Verify largest deficit is identified
    stats_gap = next((g for g in gap_data["gaps"] if g["skill"] == "Statistics"), None)
    assert stats_gap is not None
    assert stats_gap["current"] == 42
    assert stats_gap["required"] == 75
    assert stats_gap["gap"] == -33
    assert stats_gap["deficitPercent"] == 33
    assert stats_gap["urgency"] == "critical"

    # Verify gaps are sorted with largest deficit first
    first_gap = gap_data["gaps"][0]
    assert first_gap["gap"] <= gap_data["gaps"][-1]["gap"]
    assert gap_data["criticalGapsCount"] >= 1

def test_switch_role_and_gap_recalculation(client):
    res = client.put("/api/v1/learner/target-role", json={"roleId": "ds"})
    assert res.status_code == 200
    profile = res.json()["data"]
    assert profile["targetRole"]["id"] == "ds"

    # Reset back to MLE
    client.put("/api/v1/learner/target-role", json={"roleId": "mle"})
