# Test users endpoint
def test_get_users_unauthorized():
    from fastapi.testclient import TestClient
    from app.main import app
    
    client = TestClient(app)
    response = client.get("/api/users/")
    assert response.status_code == 401
