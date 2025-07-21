from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from decimal import Decimal

class ScanDiseaseBase(BaseModel):
    disease_id: int
    confidence_score: Optional[Decimal] = None
    affected_area_percentage: Optional[Decimal] = None

class ScanDiseaseCreate(ScanDiseaseBase):
    pass

class ScanDisease(ScanDiseaseBase):
    id: int
    scan_id: int
    
    class Config:
        from_attributes = True

class PlantScanBase(BaseModel):
    plant_id: Optional[int] = None
    image_url: str
    result_type: Optional[str] = None
    confidence_score: Optional[Decimal] = None
    detected_diseases: Optional[List[Dict[str, Any]]] = None
    recommendations: Optional[str] = None
    location_lat: Optional[Decimal] = None
    location_lng: Optional[Decimal] = None

class PlantScanCreate(PlantScanBase):
    pass

class PlantScanUpdate(BaseModel):
    plant_id: Optional[int] = None
    result_type: Optional[str] = None
    confidence_score: Optional[Decimal] = None
    detected_diseases: Optional[List[Dict[str, Any]]] = None
    recommendations: Optional[str] = None

class DetectedDisease(BaseModel):
    rank: int
    class_name: str
    confidence: float
    class_index: int
    
class PlantScan(PlantScanBase):
    id: int
    user_id: int
    scan_date: datetime
    detected_diseases: Optional[List[DetectedDisease]] = None
    
    class Config:
        from_attributes = True
