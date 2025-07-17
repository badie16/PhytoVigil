from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.scan import PlantScan, ScanDisease
from app.schemas.scan import PlantScanCreate, PlantScanUpdate, ScanDiseaseCreate

def get_scan(db: Session, scan_id: int) -> Optional[PlantScan]:
    return db.query(PlantScan).filter(PlantScan.id == scan_id).first()

def get_scans_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[PlantScan]:
    return db.query(PlantScan).filter(PlantScan.user_id == user_id).offset(skip).limit(limit).all()

def get_scans_by_plant(db: Session, plant_id: int, skip: int = 0, limit: int = 100) -> List[PlantScan]:
    return db.query(PlantScan).filter(PlantScan.plant_id == plant_id).offset(skip).limit(limit).all()

def create_scan(db: Session, scan: PlantScanCreate, user_id: int) -> PlantScan:
    db_scan = PlantScan(**scan, user_id=user_id)
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
    return db_scan

def update_scan(db: Session, scan_id: int, scan_update: PlantScanUpdate) -> Optional[PlantScan]:
    db_scan = db.query(PlantScan).filter(PlantScan.id == scan_id).first()
    if db_scan:
        update_data = scan_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_scan, field, value)
        db.commit()
        db.refresh(db_scan)
    return db_scan

def delete_scan(db: Session, scan_id: int) -> bool:
    db_scan = db.query(PlantScan).filter(PlantScan.id == scan_id).first()
    if db_scan:
        db.delete(db_scan)
        db.commit()
        return True
    return False

def create_scan_disease(db: Session, scan_disease: ScanDiseaseCreate, scan_id: int) -> ScanDisease:
    db_scan_disease = ScanDisease(**scan_disease, scan_id=scan_id)
    db.add(db_scan_disease)
    db.commit()
    db.refresh(db_scan_disease)
    return db_scan_disease
