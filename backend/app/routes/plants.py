from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.schemas.plant import Plant, PlantCreate, PlantUpdate
from app.crud import plant as crud_plant
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Plant])
def get_user_plants(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer toutes les plantes de l'utilisateur connecté"""
    plants = crud_plant.get_plants_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return plants

@router.get("/{plant_id}", response_model=Plant)
def get_plant(
    plant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer une plante spécifique"""
    plant = crud_plant.get_plant(db, plant_id=plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail="Plante non trouvée")
    if plant.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    return plant

@router.post("/", response_model=Plant, status_code=status.HTTP_201_CREATED)
def create_plant(
    plant: PlantCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Créer une nouvelle plante"""
    return crud_plant.create_plant(db=db, plant=plant, user_id=current_user.id)

@router.put("/{plant_id}", response_model=Plant)
def update_plant(
    plant_id: int,
    plant_update: PlantUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mettre à jour une plante"""
    plant = crud_plant.get_plant(db, plant_id=plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail="Plante non trouvée")
    if plant.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    updated_plant = crud_plant.update_plant(db=db, plant_id=plant_id, plant_update=plant_update)
    return updated_plant

@router.delete("/{plant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plant(
    plant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprimer une plante"""
    plant = crud_plant.get_plant(db, plant_id=plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail="Plante non trouvée")
    if plant.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    success = crud_plant.delete_plant(db=db, plant_id=plant_id)
    if not success:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression")
