from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.plant import Plant
from app.schemas.plant import PlantCreate, PlantUpdate

def get_plant(db: Session, plant_id: int) -> Optional[Plant]:
    return db.query(Plant).filter(Plant.id == plant_id).first()

def get_plants_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Plant]:
    return db.query(Plant).filter(Plant.user_id == user_id).offset(skip).limit(limit).all()

def create_plant(db: Session, plant: PlantCreate, user_id: int) -> Plant:
    db_plant = Plant(**plant.dict(), user_id=user_id)
    db.add(db_plant)
    db.commit()
    db.refresh(db_plant)
    return db_plant

def update_plant(db: Session, plant_id: int, plant_update: PlantUpdate) -> Optional[Plant]:
    db_plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if db_plant:
        update_data = plant_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_plant, field, value)
        db.commit()
        db.refresh(db_plant)
    return db_plant

def delete_plant(db: Session, plant_id: int) -> bool:
    db_plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if db_plant:
        db.delete(db_plant)
        db.commit()
        return True
    return False
