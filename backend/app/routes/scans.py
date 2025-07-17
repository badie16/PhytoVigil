from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.schemas.scan import PlantScan, PlantScanCreate, PlantScanUpdate
from app.crud import scan as crud_scan
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[PlantScan])
def get_user_scans(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer tous les scans de l'utilisateur connecté"""
    scans = crud_scan.get_scans_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return scans

@router.get("/{scan_id}", response_model=PlantScan)
def get_scan(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer un scan spécifique"""
    scan = crud_scan.get_scan(db, scan_id=scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan non trouvé")
    if scan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    return scan

@router.get("/plants/{plant_id}/scans", response_model=List[PlantScan])
def get_plant_scans(
    plant_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer tous les scans d'une plante spécifique"""
    # Vérifier que la plante appartient à l'utilisateur
    from app.crud import plant as crud_plant
    plant = crud_plant.get_plant(db, plant_id=plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail="Plante non trouvée")
    if plant.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    scans = crud_scan.get_scans_by_plant(db, plant_id=plant_id, skip=skip, limit=limit)
    return scans

@router.post("/", response_model=PlantScan, status_code=status.HTTP_201_CREATED)
def create_scan(
    scan: PlantScanCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Créer un nouveau scan"""
    # Si plant_id est fourni, vérifier que la plante appartient à l'utilisateur
    if scan.plant_id:
        from app.crud import plant as crud_plant
        plant = crud_plant.get_plant(db, plant_id=scan.plant_id)
        if not plant:
            raise HTTPException(status_code=404, detail="Plante non trouvée")
        if plant.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    return crud_scan.create_scan(db=db, scan=scan, user_id=current_user.id)

@router.put("/{scan_id}", response_model=PlantScan)
def update_scan(
    scan_id: int,
    scan_update: PlantScanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mettre à jour un scan"""
    scan = crud_scan.get_scan(db, scan_id=scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan non trouvé")
    if scan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    updated_scan = crud_scan.update_scan(db=db, scan_id=scan_id, scan_update=scan_update)
    return updated_scan

@router.delete("/{scan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scan(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprimer un scan"""
    scan = crud_scan.get_scan(db, scan_id=scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan non trouvé")
    if scan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    success = crud_scan.delete_scan(db=db, scan_id=scan_id)
    if not success:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression")
