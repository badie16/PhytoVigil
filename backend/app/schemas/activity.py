from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class ActivityBase(BaseModel):
    type: str
    title: str
    description: Optional[str] = None
    plant_id: Optional[int] = None
    scan_id: Optional[int] = None
    status: Optional[str] = "active"
    metadata: Optional[Dict[str, Any]] = None

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class ActivityResponse(ActivityBase):
    id: str
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    # Relations optionnelles
    plant_name: Optional[str] = None
    plant_type: Optional[str] = None
    
    class Config:
        from_attributes = True

class ActivityStats(BaseModel):
    total_activities: int
    scans: int
    plants_added: int
    diseases_detected: int
    treatments_applied: int
    by_type: Dict[str, int]
