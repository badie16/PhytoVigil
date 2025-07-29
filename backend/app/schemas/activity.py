from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class ActivityBase(BaseModel):
    type: str = Field(..., description="Type d'activité (scan, plant_added, disease_detected, etc.)")
    title: str = Field(..., description="Titre de l'activité")
    description: Optional[str] = Field(None, description="Description détaillée")
    plant_id: Optional[int] = Field(None, description="ID de la plante associée")
    scan_id: Optional[int] = Field(None, description="ID du scan associé")
    status: Optional[str] = Field("active", description="Statut de l'activité")
    meta_data: Optional[Dict[str, Any]] = Field(None, description="Métadonnées additionnelles")

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(BaseModel):
    status: Optional[str] = None
    meta_data: Optional[Dict[str, Any]] = None

class ActivityResponse(ActivityBase):
    id: str
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    # Informations enrichies
    plant_name: Optional[str] = None
    plant_type: Optional[str] = None
    scan_image_url: Optional[str] = None
    
    class Config:
        from_attributes = True

class ActivityStats(BaseModel):
    total_activities: int
    scans: int
    plants_added: int
    diseases_detected: int
    treatments_applied: int
    by_type: Dict[str, int]
    recent_activity_count: int = Field(description="Nombre d'activités des 7 derniers jours")
    
class ActivityListResponse(BaseModel):
    activities: List[ActivityResponse]
    total: int
    page: int
    per_page: int
    has_next: bool
