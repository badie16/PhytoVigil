from sqlalchemy.orm import Session
from app.models.user import User

def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()
