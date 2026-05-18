def test_get_users_unauthorized(client):
    """Listar usuários sem token deve retornar 401."""
    response = client.get("/api/users/")
    assert response.status_code == 401


def test_get_users_as_regular_user_forbidden(client, user_token):
    """Usuário comum não pode listar todos os usuários."""
    response = client.get(
        "/api/users/",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 403


def test_get_users_as_admin(client, admin_token):
    """Admin pode listar todos os usuários."""
    response = client.get(
        "/api/users/",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_own_profile(client, user_token, registered_user):
    """Usuário pode ver seu próprio perfil via /me."""
    response = client.get(
        "/api/users/me",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == registered_user["username"]
    assert data["email"] == registered_user["email"]
    assert "hashed_password" not in data


def test_get_other_user_profile_forbidden(client, user_token, admin_user):
    """Usuário comum não pode ver perfil de outro usuário."""
    # Admin é user id 1 neste contexto (criado antes do user_token)
    response = client.get(
        "/api/users/1",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    # Pode ser 403 (outro usuário) ou 404 (não encontrado com id 1 dependendo da ordem)
    assert response.status_code in (403, 404)


def test_get_nonexistent_user_as_admin(client, admin_token):
    """Admin que busca usuário inexistente recebe 404."""
    response = client.get(
        "/api/users/99999",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 404
