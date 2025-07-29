from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta

from app.database import get_db
from app.models.user import User
from app.core.security import get_current_user
from app.schemas.activity import (
    ActivityResponse, 
    ActivityCreate, 
    ActivityUpdate, 
    ActivityStats,
    ActivityListResponse
)
from app.crud.activity import (
    get_recent_activities,
    get_activities_by_type,
    get_plant_activities,
    create_activity,
    update_activity_status,
    get_activity_stats
)

router = APIRouter()

@router.get("/recent", response_model=List[ActivityResponse])
def get_recent_user_activities(
    limit: int = Query(10, ge=1, le=50),
    skip: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer les activités récentes de l'utilisateur avec informations enrichies"""
    activities = get_recent_activities(db, current_user.id, limit, skip)
    
    # Enrichir les activités avec les informations des plantes et scans
    enriched_activities = []
    for activity in activities:
        activity_dict = {
            "id": activity.id,
            "user_id": activity.user_id,
            "type": activity.type,
            "title": activity.title,
            "description": activity.description,
            "plant_id": activity.plant_id,
            "scan_id": activity.scan_id,
            "status": activity.status,
            "meta_data": activity.meta_data,
            "created_at": activity.created_at,
            "updated_at": activity.updated_at,
            "plant_name": None,
            "plant_type": None,
            "scan_image_url": None
        }
        
        # Ajouter les informations de la plante si disponible
        if activity.plant:
            activity_dict["plant_name"] = activity.plant.name
            activity_dict["plant_type"] = activity.plant.type
        
        # Ajouter les informations du scan si disponible
        if activity.scan:
            activity_dict["scan_image_url"] = activity.scan.image_url
        
        enriched_activities.append(ActivityResponse(**activity_dict))
    
    return enriched_activities

@router.get("/by-type/{activity_type}", response_model=List[ActivityResponse])
def get_activities_by_activity_type(
    activity_type: str,
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer les activités par type"""
    activities = get_activities_by_type(db, current_user.id, activity_type, limit)
    
    enriched_activities = []
    for activity in activities:
        activity_dict = {
            "id": activity.id,
            "user_id": activity.user_id,
            "type": activity.type,
            "title": activity.title,
            "description": activity.description,
            "plant_id": activity.plant_id,
            "scan_id": activity.scan_id,
            "status": activity.status,
            "meta_data": activity.meta_data,
            "created_at": activity.created_at,
            "updated_at": activity.updated_at,
            "plant_name": activity.plant.name if activity.plant else None,
            "plant_type": activity.plant.type if activity.plant else None,
            "scan_image_url": activity.scan.image_url if activity.scan else None
        }
        enriched_activities.append(ActivityResponse(**activity_dict))
    
    return enriched_activities

@router.get("/plant/{plant_id}", response_model=List[ActivityResponse])
def get_activities_for_plant(
    plant_id: int,
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer les activités d'une plante spécifique"""
    # Vérifier que la plante appartient à l'utilisateur
    from app.crud import plant as crud_plant
    plant = crud_plant.get_plant(db, plant_id=plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail="Plante non trouvée")
    if plant.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    activities = get_plant_activities(db, current_user.id, plant_id, limit)
    
    enriched_activities = []
    for activity in activities:
        activity_dict = {
            "id": activity.id,
            "user_id": activity.user_id,
            "type": activity.type,
            "title": activity.title,
            "description": activity.description,
            "plant_id": activity.plant_id,
            "scan_id": activity.scan_id,
            "status": activity.status,
            "meta_data": activity.meta_data,
            "created_at": activity.created_at,
            "updated_at": activity.updated_at,
            "plant_name": plant.name,
            "plant_type": plant.type,
            "scan_image_url": activity.scan.image_url if activity.scan else None
        }
        enriched_activities.append(ActivityResponse(**activity_dict))
    
    return enriched_activities

@router.post("/", response_model=ActivityResponse)
def create_manual_activity(
    activity: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Créer une activité manuellement"""
    # Vérifier que la plante appartient à l'utilisateur si plant_id est fourni
    if activity.plant_id:
        from app.crud import plant as crud_plant
        plant = crud_plant.get_plant(db, plant_id=activity.plant_id)
        if not plant:
            raise HTTPException(status_code=404, detail="Plante non trouvée")
        if plant.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    new_activity = create_activity(db, activity, current_user.id)
    
    # Enrichir la réponse
    activity_dict = {
        "id": new_activity.id,
        "user_id": new_activity.user_id,
        "type": new_activity.type,
        "title": new_activity.title,
        "description": new_activity.description,
        "plant_id": new_activity.plant_id,
        "scan_id": new_activity.scan_id,
        "status": new_activity.status,
        "meta_data": new_activity.meta_data,
        "created_at": new_activity.created_at,
        "updated_at": new_activity.updated_at,
        "plant_name": new_activity.plant.name if new_activity.plant else None,
        "plant_type": new_activity.plant.type if new_activity.plant else None,
        "scan_image_url": new_activity.scan.image_url if new_activity.scan else None
    }
    
    return ActivityResponse(**activity_dict)

@router.patch("/{activity_id}/status", response_model=ActivityResponse)
def update_activity_status_endpoint(
    activity_id: str,
    status_update: ActivityUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mettre à jour le statut d'une activité"""
    if not status_update.status:
        raise HTTPException(status_code=400, detail="Le statut est requis")
    
    updated_activity = update_activity_status(
        db, activity_id, current_user.id, status_update.status
    )
    
    if not updated_activity:
        raise HTTPException(status_code=404, detail="Activité non trouvée")
    
    # Enrichir la réponse
    activity_dict = {
        "id": updated_activity.id,
        "user_id": updated_activity.user_id,
        "type": updated_activity.type,
        "title": updated_activity.title,
        "description": updated_activity.description,
        "plant_id": updated_activity.plant_id,
        "scan_id": updated_activity.scan_id,
        "status": updated_activity.status,
        "meta_data": updated_activity.meta_data,
        "created_at": updated_activity.created_at,
        "updated_at": updated_activity.updated_at,
        "plant_name": updated_activity.plant.name if updated_activity.plant else None,
        "plant_type": updated_activity.plant.type if updated_activity.plant else None,
        "scan_image_url": updated_activity.scan.image_url if updated_activity.scan else None
    }
    
    return ActivityResponse(**activity_dict)

@router.get("/stats", response_model=ActivityStats)
def get_user_activity_stats(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer les statistiques d'activité de l'utilisateur"""
    stats = get_activity_stats(db, current_user.id, days)
    
    # Ajouter le nombre d'activités récentes (7 derniers jours)
    recent_activities = get_recent_activities(db, current_user.id, limit=1000)
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_count = len([a for a in recent_activities if a.created_at >= week_ago])
    
    return ActivityStats(
        **stats,
        recent_activity_count=recent_count
    )
