from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DiseaseBase(BaseModel):
    name: str
    scientific_name: Optional[str] = None
    description: Optional[str] = None
    symptoms: Optional[str] = None
    treatment: Optional[str] = None
    prevention: Optional[str] = None
    severity_level: Optional[int] = None
    image_url: Optional[str] = None

class DiseaseCreate(DiseaseBase):
    pass

class DiseaseUpdate(BaseModel):
    name: Optional[str] = None
    scientific_name: Optional[str] = None
    description: Optional[str] = None
    symptoms: Optional[str] = None
    treatment: Optional[str] = None
    prevention: Optional[str] = None
    severity_level: Optional[int] = None
    image_url: Optional[str] = None

class Disease(DiseaseBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
