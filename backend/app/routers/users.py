# backend/app/routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app import database, auth, crud, schemas
from app.auth import get_current_active_user, get_current_admin_user

router = APIRouter()

@router.get("/me", response_model=schemas.UserResponse)
def get_current_user_info(
    current_user = Depends(get_current_active_user),
    db: Session = Depends(database.get_db)
):
    """
    Retorna o usuário atualmente logado
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user

@router.get("/", response_model=List[schemas.UserResponse])
def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_admin_user)
):
    """
    Retorna lista de usuários (apenas admin)
    """
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=schemas.UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(database.get_db),
    current_user = Depends(get_current_active_user)
):
    """
    Retorna um usuário específico (próprio perfil ou admin)
    """
    # Users can only view their own profile unless admin
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Not authorized to view this user"
        )
    
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
    return user