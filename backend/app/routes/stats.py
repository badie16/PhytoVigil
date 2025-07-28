from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import stats as stats_crud
from app.schemas.stats import ScanStatsResponse, PlantStatsResponse, DiseaseStatsResponse
from app.core.security import get_current_user
from app.models.user import User
from typing import List

router = APIRouter()

@router.get("/scans", response_model=ScanStatsResponse)
def get_scan_statistics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Récupère les statistiques globales des scans pour l'utilisateur connecté.
    """
    return stats_crud.get_global_scan_stats(db, current_user.id)

@router.get("/plants/{plant_id}", response_model=PlantStatsResponse)
def get_plant_statistics(
    plant_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Récupère les statistiques des scans pour une plante spécifique de l'utilisateur connecté.
    """
    try:
        return stats_crud.get_stats_by_plant(db, current_user.id, plant_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Plant not found")

@router.get("/diseases", response_model=List[DiseaseStatsResponse])
def get_disease_statistics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Récupère les statistiques des maladies détectées dans les scans de l'utilisateur connecté.
    """
    return stats_crud.get_disease_stats(db, current_user.id)
