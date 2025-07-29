from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.schemas.plant import Plant, PlantCreate, PlantUpdate
from app.crud import plant as crud_plant
from app.core.security import get_current_user
from app.crud.activity import create_plant_activity

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
    # Créer la plante
    new_plant = crud_plant.create_plant(db=db, plant=plant, user_id=current_user.id)
    # AUTO-GÉNÉRATION D'ACTIVITÉ POUR L'AJOUT DE PLANTE
    try:
        plant_activity = create_plant_activity(
            db=db,
            user_id=current_user.id,
            plant_id=new_plant.id
        )
        print(f"✅ Activité de plante créée: {plant_activity.id}")
    except Exception as e:
        print(f"⚠️ Erreur lors de la création de l'activité de plante: {str(e)}")
        # Ne pas faire échouer la création de la plante si l'activité échoue
    
    return new_plant

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
    # AUTO-GÉNÉRATION D'ACTIVITÉ POUR LA MISE À JOUR DE PLANTE
    try:
        from app.crud.activity import create_activity
        from app.schemas.activity import ActivityCreate
        
        # Déterminer quels champs ont été modifiés
        changes = []
        if plant_update.name and plant_update.name != plant.name:
            changes.append(f"name: {plant.name} → {plant_update.name}")
        if plant_update.location and plant_update.location != plant.location:
            changes.append(f"location: {plant.location} → {plant_update.location}")
        if plant_update.notes and plant_update.notes != plant.notes:
            changes.append("notes updated")
        
        if changes:
            activity_data = ActivityCreate(
                type="plant_updated",
                title="Plant Updated",
                description=f"Updated {updated_plant.name}: {', '.join(changes)}",
                plant_id=plant_id,
                metadata={
                    "changes": changes,
                    "updated_fields": list(plant_update.dict(exclude_unset=True).keys())
                }
            )
            
            update_activity = create_activity(db, activity_data, current_user.id)
            print(f"✅ Activité de mise à jour créée: {update_activity.id}")
    except Exception as e:
        print(f"⚠️ Erreur lors de la création de l'activité de mise à jour: {str(e)}")
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
    # Sauvegarder les infos de la plante avant suppression
    plant_name = plant.name
    plant_type = plant.type
    
    # AUTO-GÉNÉRATION D'ACTIVITÉ POUR LA SUPPRESSION DE PLANTE
    try:
        from app.crud.activity import create_activity
        from app.schemas.activity import ActivityCreate
        
        activity_data = ActivityCreate(
            type="plant_deleted",
            title="Plant Removed",
            description=f"Removed {plant_name} from your garden",
            plant_id=None,  # La plante sera supprimée
            metadata={
                "deleted_plant_name": plant_name,
                "deleted_plant_type": plant_type,
                "deleted_plant_id": plant_id
            }
        )
        
        delete_activity = create_activity(db, activity_data, current_user.id)
        print(f"✅ Activité de suppression créée: {delete_activity.id}")
    except Exception as e:
        print(f"⚠️ Erreur lors de la création de l'activité de suppression: {str(e)}")
    
    # Supprimer la plante
    success = crud_plant.delete_plant(db=db, plant_id=plant_id)
    if not success:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression")
