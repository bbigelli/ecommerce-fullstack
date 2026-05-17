import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def registered_user(client):
    """Cria um usuário comum e retorna seus dados."""
    response = client.post("/api/register", json={
        "email": "user@test.com",
        "username": "testuser",
        "password": "testpass123"
    })
    assert response.status_code == 200
    return {"email": "user@test.com", "username": "testuser", "password": "testpass123"}


@pytest.fixture
def user_token(client, registered_user):
    """Retorna o token JWT de um usuário comum."""
    response = client.post("/api/token", data={
        "username": registered_user["username"],
        "password": registered_user["password"]
    })
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture
def admin_user(client):
    """Cria usuário admin diretamente no banco."""
    from app.database import SessionLocal
    from app.crud import create_user
    from app.schemas import UserCreate

    db = TestingSessionLocal()
    user = create_user(db, UserCreate(
        email="admin@test.com",
        username="admin",
        password="adminpass123"
    ))
    user.is_admin = True
    db.commit()
    db.close()
    return {"username": "admin", "password": "adminpass123"}


@pytest.fixture
def admin_token(client, admin_user):
    """Retorna o token JWT do admin."""
    response = client.post("/api/token", data={
        "username": admin_user["username"],
        "password": admin_user["password"]
    })
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture
def sample_product_data():
    return {
        "name": "Vaso de Cerâmica Artesanal",
        "description": "Vaso feito à mão com argila especial",
        "price": 89.90,
        "stock": 0,
        "category": "Decoração",
        "image_url": "https://example.com/vaso.jpg"
    }