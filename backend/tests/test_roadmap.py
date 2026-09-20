def test_get_roadmap_initial(client):
    res = client.get("/api/v1/roadmap")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    roadmap = data["data"]
    assert roadmap["totalModules"] == 14
    assert len(roadmap["stages"]) == 3

    # Stage 1 initial nodes
    stage_1 = roadmap["stages"][0]
    assert stage_1["status"] == "in_progress"
    node_ids = [n["id"] for n in stage_1["nodes"]]
    assert "node_python" in node_ids
    assert "node_stats" in node_ids
    # Before challenge evaluation, adaptive insert should not be active
    assert roadmap["isAdaptiveUpdated"] is False
