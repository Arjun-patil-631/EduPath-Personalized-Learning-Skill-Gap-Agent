def test_get_assessment_questions(client):
    res = client.get("/api/v1/assessment/questions")
    assert res.status_code == 200
    data = res.json()["data"]
    assert len(data) == 4
    for q in data:
        assert "id" in q
        assert "skill" in q
        assert len(q["options"]) == 4

def test_submit_assessment(client):
    payload = {
        "answers": {
            "q1": "c",
            "q2": "c",
            "q3": "b",
            "q4": "b"
        }
    }
    res = client.post("/api/v1/assessment/submit", json=payload)
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["assessmentCompleted"] is True
    assert "Python" in data["evaluatedScores"]
