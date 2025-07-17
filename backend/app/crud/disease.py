from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.disease import Disease
from app.schemas.disease import DiseaseCreate, DiseaseUpdate

def get_disease(db: Session, disease_id: int) -> Optional[Disease]:
    return db.query(Disease).filter(Disease.id == disease_id).first()

def get_disease_by_name(db: Session, name: str) -> Optional[Disease]:
    return db.query(Disease).filter(Disease.name == name).first()

def get_diseases(db: Session, skip: int = 0, limit: int = 100) -> List[Disease]:
    return db.query(Disease).offset(skip).limit(limit).all()

def create_disease(db: Session, disease: DiseaseCreate) -> Disease:
    db_disease = Disease(**disease.dict())
    db.add(db_disease)
    db.commit()
    db.refresh(db_disease)
    return db_disease

def update_disease(db: Session, disease_id: int, disease_update: DiseaseUpdate) -> Optional[Disease]:
    db_disease = db.query(Disease).filter(Disease.id == disease_id).first()
    if db_disease:
        update_data = disease_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_disease, field, value)
        db.commit()
        db.refresh(db_disease)
    return db_disease

def delete_disease(db: Session, disease_id: int) -> bool:
    db_disease = db.query(Disease).filter(Disease.id == disease_id).first()
    if db_disease:
        db.delete(db_disease)
        db.commit()
        return True
    return False
