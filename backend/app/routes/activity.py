from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.activity import ActivityResponse, ActivityCreate, ActivityUpdate, ActivityStats
from app.crud import activity as crud_activity

router = APIRouter()

@router.get("/recent", response_model=List[ActivityResponse])
async def get_recent_activities(
    limit: int = Query(10, ge=1, le=50),
    skip: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère les activités récentes de l'utilisateur"""
    activities = crud_activity.get_recent_activities(
        db=db, 
        user_id=current_user.id, 
        limit=limit, 
        skip=skip
    )
    
    # Enrichir avec les informations des plantes
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
            "metadata": activity.metadata,
            "created_at": activity.created_at,
            "updated_at": activity.updated_at,
            "plant_name": activity.plant.name if activity.plant else None,
            "plant_type": activity.plant.type if activity.plant else None
        }
        enriched_activities.append(ActivityResponse(**activity_dict))
    
    return enriched_activities

@router.get("/by-type/{activity_type}", response_model=List[ActivityResponse])
async def get_activities_by_type(
    activity_type: str,
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère les activités par type"""
    activities = crud_activity.get_activities_by_type(
        db=db,
        user_id=current_user.id,
        activity_type=activity_type,
        limit=limit
    )
    
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
            "metadata": activity.metadata,
            "created_at": activity.created_at,
            "updated_at": activity.updated_at,
            "plant_name": activity.plant.name if activity.plant else None,
            "plant_type": activity.plant.type if activity.plant else None
        }
        enriched_activities.append(ActivityResponse(**activity_dict))
    
    return enriched_activities

@router.get("/plant/{plant_id}", response_model=List[ActivityResponse])
async def get_plant_activities(
    plant_id: int,
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère les activités d'une plante spécifique"""
    activities = crud_activity.get_plant_activities(
        db=db,
        user_id=current_user.id,
        plant_id=plant_id,
        limit=limit
    )
    
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
            "metadata": activity.metadata,
            "created_at": activity.created_at,
            "updated_at": activity.updated_at,
            "plant_name": activity.plant.name if activity.plant else None,
            "plant_type": activity.plant.type if activity.plant else None
        }
        enriched_activities.append(ActivityResponse(**activity_dict))
    
    return enriched_activities

@router.post("/", response_model=ActivityResponse)
async def create_activity(
    activity: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Crée une nouvelle activité"""
    db_activity = crud_activity.create_activity(
        db=db,
        activity=activity,
        user_id=current_user.id
    )
    
    activity_dict = {
        "id": db_activity.id,
        "user_id": db_activity.user_id,
        "type": db_activity.type,
        "title": db_activity.title,
        "description": db_activity.description,
        "plant_id": db_activity.plant_id,
        "scan_id": db_activity.scan_id,
        "status": db_activity.status,
        "metadata": db_activity.metadata,
        "created_at": db_activity.created_at,
        "updated_at": db_activity.updated_at,
        "plant_name": db_activity.plant.name if db_activity.plant else None,
        "plant_type": db_activity.plant.type if db_activity.plant else None
    }
    
    return ActivityResponse(**activity_dict)

@router.patch("/{activity_id}/status")
async def update_activity_status(
    activity_id: str,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Met à jour le statut d'une activité"""
    if status not in ["active", "archived", "dismissed"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    activity = crud_activity.update_activity_status(
        db=db,
        activity_id=activity_id,
        user_id=current_user.id,
        status=status
    )
    
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    return {"message": "Activity status updated successfully"}

@router.get("/stats", response_model=ActivityStats)
async def get_activity_stats(
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupère les statistiques d'activité"""
    stats = crud_activity.get_activity_stats(
        db=db,
        user_id=current_user.id,
        days=days
    )
    
    return ActivityStats(**stats)
