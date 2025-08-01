from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.push_token import PushTokenCreate, PushTokenResponse
from app.crud.push_token import create_push_token, get_user_tokens
from app.core.security import get_current_user
from typing import List
router = APIRouter()

@router.post("/", response_model=PushTokenResponse)
def register_push_token(
    token_data: PushTokenCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Enregistre un token push pour l'utilisateur."""
    return create_push_token(db, current_user.id, token_data)


@router.get("/", response_model=List[PushTokenResponse])
def get_user_tokens(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    """Récupère tous les tokens push pour l'utilisateur."""
    return get_user_tokens(db, current_user.id)


