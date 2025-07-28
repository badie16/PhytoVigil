from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.models.scan import PlantScan
from app.models.scan import ScanDisease
from app.models.disease import Disease
from app.models.plant import Plant
from app.schemas.stats import ScanStatsResponse, PlantStatsResponse, DiseaseStatsResponse
from typing import List

def get_global_scan_stats(db: Session, user_id: int) -> ScanStatsResponse:
    total_scans = db.query(func.count(PlantScan.id)).filter(PlantScan.user_id == user_id).scalar() or 0
    healthy_scans = db.query(func.count(PlantScan.id)).filter(PlantScan.user_id == user_id, PlantScan.result_type == "healthy").scalar() or 0
    diseased_scans = db.query(func.count(PlantScan.id)).filter(PlantScan.user_id == user_id, PlantScan.result_type == "diseased").scalar() or 0
    unknown_scans = db.query(func.count(PlantScan.id)).filter(PlantScan.user_id == user_id, PlantScan.result_type == "unknown").scalar() or 0
    total_plantScaned = db.query(func.count(func.distinct(PlantScan.plant_id))).filter(PlantScan.user_id == user_id).scalar() or 0
    most_common_disease = (
        db.query(Disease.name, func.count(ScanDisease.id).label("count"))
        .join(ScanDisease, ScanDisease.disease_id == Disease.id)
        .join(PlantScan, PlantScan.id == ScanDisease.scan_id)
        .filter(PlantScan.user_id == user_id)
        .group_by(Disease.name)
        .order_by(desc("count"))
        .limit(1)
        .first()
    )

    last_scan_date = db.query(func.max(PlantScan.scan_date)).filter(PlantScan.user_id == user_id).scalar()

    return ScanStatsResponse(
        total_scans=total_scans,
        total_plantScaned=total_plantScaned,
        healthy_scans=healthy_scans,
        diseased_scans=diseased_scans,
        unknown_scans=unknown_scans,
        most_common_disease=most_common_disease[0] if most_common_disease else None,
        last_scan_date=last_scan_date.isoformat() if last_scan_date else None,
    )


def get_stats_by_plant(db: Session, user_id: int, plant_id: int) -> PlantStatsResponse:
    total_scans = db.query(func.count(PlantScan.id)).filter(PlantScan.user_id == user_id, PlantScan.plant_id == plant_id).scalar() or 0
    healthy_scans = db.query(func.count(PlantScan.id)).filter(PlantScan.user_id == user_id, PlantScan.plant_id == plant_id, PlantScan.result_type == "healthy").scalar() or 0
    diseased_scans = db.query(func.count(PlantScan.id)).filter(PlantScan.user_id == user_id, PlantScan.plant_id == plant_id, PlantScan.result_type == "diseased").scalar() or 0
    unknown_scans = db.query(func.count(PlantScan.id)).filter(PlantScan.user_id == user_id, PlantScan.plant_id == plant_id, PlantScan.result_type == "unknown").scalar() or 0
    last_scan_date = db.query(func.max(PlantScan.scan_date)).filter(PlantScan.user_id == user_id, PlantScan.plant_id == plant_id).scalar()

    plant = db.query(Plant).filter(Plant.id == plant_id, Plant.user_id == user_id).first()
    if not plant:
        raise ValueError("Plant not found")

    return PlantStatsResponse(
        plant_id=plant.id,
        plant_name=plant.name,
        total_scans=total_scans,
        healthy_scans=healthy_scans,
        diseased_scans=diseased_scans,
        unknown_scans=unknown_scans,
        last_scan_date=last_scan_date.isoformat() if last_scan_date else None,
    )


def get_disease_stats(db: Session, user_id: int, limit: int = 10) -> List[DiseaseStatsResponse]:
    top_diseases = (
        db.query(Disease.name, func.count(ScanDisease.id).label("scan_count"))
        .join(ScanDisease, ScanDisease.disease_id == Disease.id)
        .join(PlantScan, PlantScan.id == ScanDisease.scan_id)
        .filter(PlantScan.user_id == user_id)
        .group_by(Disease.name)
        .order_by(desc("scan_count"))
        .limit(limit)
        .all()
    )

    return [DiseaseStatsResponse(disease_name=d.name, scan_count=d.scan_count) for d in top_diseases]
