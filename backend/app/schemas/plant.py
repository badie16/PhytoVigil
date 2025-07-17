from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class PlantBase(BaseModel):
    name: str
    type: Optional[str] = None
    variety: Optional[str] = None
    planted_date: Optional[date] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    image_url: Optional[str] = None

class PlantCreate(PlantBase):
    pass

class PlantUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    variety: Optional[str] = None
    planted_date: Optional[date] = None
    location: Optional[str] = None
    notes: Optional[str] = None
    image_url: Optional[str] = None

class Plant(PlantBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
