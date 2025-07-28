from pydantic import BaseModel
from typing import Optional

class ScanStatsResponse(BaseModel):
    total_scans: int
    total_plantScaned:int
    healthy_scans: int
    diseased_scans: int
    unknown_scans: int
    most_common_disease: Optional[str] = None
    last_scan_date: Optional[str] = None

class PlantStatsResponse(BaseModel):
    plant_id: int
    plant_name: str
    total_scans: int
    healthy_scans: int
    diseased_scans: int
    unknown_scans: int
    last_scan_date: Optional[str] = None

class DiseaseStatsResponse(BaseModel):
    disease_name: str
    scan_count: int
