def test_list_products_public(client):
    """Listagem de produtos é pública."""
    response = client.get("/api/products/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_product_not_found(client):
    response = client.get("/api/products/99999")
    assert response.status_code == 404


def test_create_product_as_admin(client, admin_token, sample_product_data):
    response = client.post(
        "/api/products/",
        json=sample_product_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == sample_product_data["name"]
    assert data["price"] == sample_product_data["price"]
    assert "id" in data


def test_create_product_as_regular_user_forbidden(client, user_token, sample_product_data):
    """Usuário comum NÃO pode criar produto."""
    response = client.post(
        "/api/products/",
        json=sample_product_data,
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert response.status_code == 403


def test_create_product_unauthenticated_forbidden(client, sample_product_data):
    response = client.post("/api/products/", json=sample_product_data)
    assert response.status_code == 401


def test_create_product_invalid_price(client, admin_token):
    """Preço negativo deve ser rejeitado pelo Pydantic."""
    response = client.post(
        "/api/products/",
        json={"name": "Produto", "price": -10.0, "stock": 0},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 422  # Unprocessable Entity


def test_create_product_invalid_stock(client, admin_token):
    """Stock negativo deve ser rejeitado."""
    response = client.post(
        "/api/products/",
        json={"name": "Produto", "price": 10.0, "stock": -5},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 422


def test_update_product_as_admin(client, admin_token, sample_product_data):
    # Criar produto
    create_response = client.post(
        "/api/products/",
        json=sample_product_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    product_id = create_response.json()["id"]

    # Atualizar
    update_response = client.put(
        f"/api/products/{product_id}",
        json={"price": 99.90, "description": "Descrição atualizada"},
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert update_response.status_code == 200
    assert update_response.json()["price"] == 99.90


def test_delete_product_as_admin(client, admin_token, sample_product_data):
    # Criar produto
    create_response = client.post(
        "/api/products/",
        json=sample_product_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    product_id = create_response.json()["id"]

    # Deletar
    delete_response = client.delete(
        f"/api/products/{product_id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert delete_response.status_code == 204

    # Confirmar que foi deletado
    get_response = client.get(f"/api/products/{product_id}")
    assert get_response.status_code == 404


def test_delete_product_as_regular_user_forbidden(client, user_token, admin_token, sample_product_data):
    # Admin cria
    create_response = client.post(
        "/api/products/",
        json=sample_product_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    product_id = create_response.json()["id"]

    # Usuário comum tenta deletar
    delete_response = client.delete(
        f"/api/products/{product_id}",
        headers={"Authorization": f"Bearer {user_token}"}
    )
    assert delete_response.status_code == 403


def test_filter_products_by_category(client, admin_token):
    # Criar produtos em categorias diferentes
    for cat, name in [("Decoração", "Vaso"), ("Bijuteria", "Anel"), ("Decoração", "Quadro")]:
        client.post("/api/products/", json={
            "name": name, "price": 50.0, "stock": 0, "category": cat
        }, headers={"Authorization": f"Bearer {admin_token}"})

    response = client.get("/api/products/?category=Decoração")
    assert response.status_code == 200
    products = response.json()
    assert len(products) == 2
    assert all(p["category"] == "Decoração" for p in products)