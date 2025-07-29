from sqlalchemy.orm import Session
from sqlalchemy import desc, and_
from typing import List, Optional
from datetime import datetime, timedelta
import uuid

from app.models.activity import Activity
from app.schemas.activity import ActivityCreate, ActivityUpdate

def get_recent_activities(db: Session, user_id: int, limit: int = 10, skip: int = 0) -> List[Activity]:
    """Récupère les activités récentes d'un utilisateur"""
    return db.query(Activity).filter(
        and_(
            Activity.user_id == user_id,
            Activity.status == "active"
        )
    ).order_by(desc(Activity.created_at)).offset(skip).limit(limit).all()

def get_activities_by_type(db: Session, user_id: int, activity_type: str, limit: int = 20) -> List[Activity]:
    """Récupère les activités par type"""
    return db.query(Activity).filter(
        and_(
            Activity.user_id == user_id,
            Activity.type == activity_type,
            Activity.status == "active"
        )
    ).order_by(desc(Activity.created_at)).limit(limit).all()

def get_plant_activities(db: Session, user_id: int, plant_id: int, limit: int = 20) -> List[Activity]:
    """Récupère les activités d'une plante spécifique"""
    return db.query(Activity).filter(
        and_(
            Activity.user_id == user_id,
            Activity.plant_id == plant_id,
            Activity.status == "active"
        )
    ).order_by(desc(Activity.created_at)).limit(limit).all()

def create_activity(db: Session, activity: ActivityCreate, user_id: int) -> Activity:
    """Crée une nouvelle activité"""
    activity_id = str(uuid.uuid4())
    
    db_activity = Activity(
        id=activity_id,
        user_id=user_id,
        type=activity.type,
        title=activity.title,
        description=activity.description,
        plant_id=activity.plant_id,
        scan_id=activity.scan_id,
        status=activity.status or "active",
        meta_data=activity.meta_data
    )
    
    db.add(db_activity)
    db.commit()
    db.refresh(db_activity)
    return db_activity

def update_activity_status(db: Session, activity_id: str, user_id: int, status: str) -> Optional[Activity]:
    """Met à jour le statut d'une activité"""
    activity = db.query(Activity).filter(
        and_(
            Activity.id == activity_id,
            Activity.user_id == user_id
        )
    ).first()
    
    if activity:
        activity.status = status
        activity.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(activity)
    
    return activity

def get_activity_stats(db: Session, user_id: int, days: int = 30) -> dict:
    """Récupère les statistiques d'activité"""
    since_date = datetime.utcnow() - timedelta(days=days)
    
    activities = db.query(Activity).filter(
        and_(
            Activity.user_id == user_id,
            Activity.created_at >= since_date,
            Activity.status == "active"
        )
    ).all()
    
    stats = {
        "total_activities": len(activities),
        "scans": len([a for a in activities if a.type == "scan"]),
        "plants_added": len([a for a in activities if a.type == "plant_added"]),
        "diseases_detected": len([a for a in activities if a.type == "disease_detected"]),
        "treatments_applied": len([a for a in activities if a.type == "treatment_applied"]),
        "by_type": {}
    }
    
    # Compter par type
    for activity in activities:
        if activity.type in stats["by_type"]:
            stats["by_type"][activity.type] += 1
        else:
            stats["by_type"][activity.type] = 1
    
    return stats

def create_scan_activity(db: Session, user_id: int, scan_id: int, plant_id: Optional[int] = None) -> Activity:
    """Crée automatiquement une activité pour un scan"""
    from app.models.scan import PlantScan
    
    scan = db.query(PlantScan).filter(PlantScan.id == scan_id).first()
    if not scan:
        return None
    
    # Déterminer le titre et la description selon le résultat
    if scan.result_type == "healthy":
        title = "Plant Scanned - Healthy"
        description = f"Your plant appears healthy with {scan.confidence_score:.1%} confidence"
    elif scan.result_type == "diseased":
        title = "Disease Detected"
        diseases = scan.detected_diseases or []
        if diseases:
            disease_names = [d.get('name', 'Unknown') for d in diseases[:2]]
            description = f"Detected: {', '.join(disease_names)}"
        else:
            description = "Disease detected in your plant"
    else:
        title = "Plant Scanned"
        description = "Scan completed but results are unclear"
    
    activity_data = ActivityCreate(
        type="scan",
        title=title,
        description=description,
        plant_id=plant_id or scan.plant_id,
        scan_id=scan_id,
        meta_data={
            "result_type": scan.result_type,
            "confidence_score": float(scan.confidence_score) if scan.confidence_score else None,
            "diseases": scan.detected_diseases
        }
    )
    
    return create_activity(db, activity_data, user_id)

def create_plant_activity(db: Session, user_id: int, plant_id: int) -> Activity:
    """Crée automatiquement une activité pour l'ajout d'une plante"""
    from app.models.plant import Plant
    
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        return None
    
    activity_data = ActivityCreate(
        type="plant_added",
        title="New Plant Added",
        description=f"Added {plant.name} to your garden",
        plant_id=plant_id,
        meta_data={
            "plant_type": plant.type,
            "variety": plant.variety,
            "location": plant.location
        }
    )
    
    return create_activity(db, activity_data, user_id)

def create_disease_activity(db: Session, user_id: int, plant_id: int, disease_name: str, confidence: float) -> Activity:
    """Crée une activité pour une détection de maladie"""
    activity_data = ActivityCreate(
        type="disease_detected",
        title=f"Disease Alert: {disease_name}",
        description=f"Detected {disease_name} with {confidence:.1%} confidence",
        plant_id=plant_id,
        meta_data={
            "disease_name": disease_name,
            "confidence": confidence,
            "severity": "high" if confidence > 0.8 else "medium" if confidence > 0.6 else "low"
        }
    )
    
    return create_activity(db, activity_data, user_id)
