import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_health_endpoint(client):
    rv = client.get('/api/health')
    assert rv.status_code == 200
    json_data = rv.get_json()
    assert json_data["status"] == "healthy"

def test_summary_endpoint(client):
    rv = client.get('/api/dashboard/summary')
    assert rv.status_code == 200
    json_data = rv.get_json()
    assert "totalPostsProcessed" in json_data
    assert "itemsFlaggedForReview" in json_data

def test_analyze_endpoint(client):
    rv = client.post('/api/analyze', json={
        "text": "URGENT: Enter your 6-digit OTP code at http://bank-auth.cc immediately."
    })
    assert rv.status_code == 200
    json_data = rv.get_json()
    assert json_data["category"] == "cybercrime_phishing"
    assert json_data["severity"] == "critical"
