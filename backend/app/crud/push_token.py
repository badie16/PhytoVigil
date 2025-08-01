from sqlalchemy.orm import Session
from app.models.push_token import PushToken
from app.schemas.push_token import PushTokenCreate

def create_push_token(db: Session, user_id: str, token_data: PushTokenCreate):
    # Supprimer ancien token s’il existe
    existing = db.query(PushToken).filter_by(token=token_data.token).first()
    if existing:
        db.delete(existing)
        db.commit()

    db_token = PushToken(
        user_id=user_id,
        token=token_data.token,
        device=token_data.device,
        deviceId=token_data.deviceId
    )
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    return db_token

def get_user_tokens(db: Session, user_id: str):
    return db.query(PushToken).filter_by(user_id=user_id).all()
