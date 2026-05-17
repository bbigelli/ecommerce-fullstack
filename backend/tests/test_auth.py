def test_register_success(client):
    response = client.post("/api/register", json={
        "email": "novo@test.com",
        "username": "novousuario",
        "address": "Rua Exemplo, 123",
        "password": "senha123"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "novo@test.com"
    assert data["username"] == "novousuario"
    assert data["address"] == "Rua Exemplo, 123"
    assert "hashed_password" not in data  # senha nunca exposta


def test_register_duplicate_email(client, registered_user):
    response = client.post("/api/register", json={
        "email": registered_user["email"],  # email já existente
        "username": "outrousername",
        "address": "Rua Outra, 456",
        "password": "senha123"
    })
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]


def test_register_duplicate_username(client, registered_user):
    response = client.post("/api/register", json={
        "email": "outro@test.com",
        "username": registered_user["username"],  # username já existente
        "address": "Rua Outra, 456",
        "password": "senha123"
    })
    assert response.status_code == 400
    assert "Username already taken" in response.json()["detail"]


def test_login_success(client, registered_user):
    response = client.post("/api/token", data={
        "username": registered_user["username"],
        "password": registered_user["password"]
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client, registered_user):
    response = client.post("/api/token", data={
        "username": registered_user["username"],
        "password": "senhaerrada"
    })
    assert response.status_code == 401


def test_login_nonexistent_user(client):
    response = client.post("/api/token", data={
        "username": "naoexiste",
        "password": "qualquer"
    })
    assert response.status_code == 401


def test_protected_route_without_token(client):
    response = client.get("/api/users/me")
    assert response.status_code == 401


def test_protected_route_with_invalid_token(client):
    response = client.get("/api/users/me", headers={
        "Authorization": "Bearer token_invalido_aqui"
    })
    assert response.status_code == 401


def test_get_current_user(client, user_token):
    response = client.get("/api/users/me", headers={
        "Authorization": f"Bearer {user_token}"
    })
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"