from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from app.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.scan import PlantScan
from app.models.disease import Disease
from app.models.activity import Activity
from app.schemas.stats import (
    DashboardStatsResponse,
    DashboardScansByDayItem,
    DashboardDiseaseDistributionItem,
    DashboardMonthlyGrowthItem,
    DashboardRecentActivityItem,
    DashboardChartDataResponse,
    ChartScansOverTimeItem,
    ChartUserGrowthItem,
    ChartDiseaseDetectionsItem,
    ChartSystemMetrics,
)
from sqlalchemy import func


router = APIRouter()


def verify_admin_access(current_user: User):
    """Vérifie si l'utilisateur actuel est un administrateur"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403, 
            detail="Accès refusé. Seuls les administrateurs peuvent accéder à cette ressource."
        )


@router.get("/stats", response_model=DashboardStatsResponse)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Vérifier les droits d'administrateur
    verify_admin_access(current_user)
    
    # Données globales (tous les utilisateurs)
    total_scans = db.query(func.count(PlantScan.id)).scalar() or 0
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_diseases = db.query(func.count(Disease.id)).scalar() or 0

    last_30_days = datetime.utcnow() - timedelta(days=30)
    scans_last_30 = (
        db.query(PlantScan)
        .filter(PlantScan.scan_date >= last_30_days)
        .all()
    )

    if scans_last_30:
        correct = len([s for s in scans_last_30 if s.result_type == "healthy"])  # proxy for accuracy
        accuracy = correct / max(len(scans_last_30), 1)
    else:
        accuracy = 0.0

    # Scans by day (last 7 days) - global
    scans_by_day: List[DashboardScansByDayItem] = []
    for i in range(6, -1, -1):
        day = (datetime.utcnow() - timedelta(days=i)).date()
        next_day = day + timedelta(days=1)
        daily_scans = (
            db.query(PlantScan)
            .filter(
                PlantScan.scan_date >= datetime.combine(day, datetime.min.time()),
                PlantScan.scan_date < datetime.combine(next_day, datetime.min.time()),
            )
            .all()
        )
        scans_count = len(daily_scans)
        correct_count = len([s for s in daily_scans if s.result_type == "healthy"])  # proxy
        scans_by_day.append(
            DashboardScansByDayItem(name=day.strftime("%a"), scans=scans_count, correct=correct_count)
        )

    # Disease distribution (top 5) - global
    from app.models.scan import ScanDisease
    disease_counts = (
        db.query(Disease.name, func.count(ScanDisease.id).label("count"))
        .join(ScanDisease, ScanDisease.disease_id == Disease.id)
        .join(PlantScan, PlantScan.id == ScanDisease.scan_id)
        .group_by(Disease.name)
        .order_by(func.count(ScanDisease.id).desc())
        .limit(5)
        .all()
    )
    palette = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b", "#a855f7"]
    disease_distribution = [
        DashboardDiseaseDistributionItem(name=row[0], value=row[1], color=palette[idx % len(palette)])
        for idx, row in enumerate(disease_counts)
    ]

    # Monthly growth (last 6 months) - global
    monthly_growth: List[DashboardMonthlyGrowthItem] = []
    for i in range(5, -1, -1):
        dt = datetime.utcnow() - timedelta(days=30 * i)
        month_label = dt.strftime("%b")
        month_start = datetime(dt.year, dt.month, 1)
        next_month = datetime(dt.year + (1 if dt.month == 12 else 0), (1 if dt.month == 12 else dt.month + 1), 1)
        scans_month = (
            db.query(func.count(PlantScan.id))
            .filter(
                PlantScan.scan_date >= month_start,
                PlantScan.scan_date < next_month,
            )
            .scalar()
            or 0
        )
        users_month = (
            db.query(func.count(User.id))
            .filter(User.created_at >= month_start, User.created_at < next_month)
            .scalar()
            if hasattr(User, "created_at")
            else 0
        )
        monthly_growth.append(DashboardMonthlyGrowthItem(month=month_label, users=users_month, scans=scans_month))

    # Recent activity (last 10) - global
    recent = (
        db.query(Activity)
        .order_by(Activity.created_at.desc())
        .limit(10)
        .all()
    )
    recent_activity = [
        DashboardRecentActivityItem(
            id=a.id,
            title=a.title,
            description=a.description or "",
            time=a.created_at.isoformat() if a.created_at else "",
            type=a.type,
        )
        for a in recent
    ]

    return DashboardStatsResponse(
        totalScans=total_scans,
        totalUsers=total_users,
        totalDiseases=total_diseases,
        accuracy=accuracy,
        scansByDay=scans_by_day,
        diseaseDistribution=disease_distribution,
        monthlyGrowth=monthly_growth,
        recentActivity=recent_activity,
    )


@router.get("/charts", response_model=DashboardChartDataResponse)
def get_dashboard_charts(
    timeRange: str = Query("30d", pattern="^(7d|30d|90d|1y)$"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Vérifier les droits d'administrateur
    verify_admin_access(current_user)
    
    if timeRange == "7d":
        days = 7
    elif timeRange == "30d":
        days = 30
    elif timeRange == "90d":
        days = 90
    else:
        days = 365

    start_date = datetime.utcnow() - timedelta(days=days)

    # Scans over time (per day) - global
    scans_over_time: List[ChartScansOverTimeItem] = []
    for i in range(days - 1, -1, -1):
        day = (datetime.utcnow() - timedelta(days=i)).date()
        next_day = day + timedelta(days=1)
        daily_scans = (
            db.query(PlantScan)
            .filter(
                PlantScan.scan_date >= datetime.combine(day, datetime.min.time()),
                PlantScan.scan_date < datetime.combine(next_day, datetime.min.time()),
            )
            .all()
        )
        count_scans = len(daily_scans)
        correct = len([s for s in daily_scans if s.result_type == "healthy"])  # proxy
        acc = (correct / count_scans) if count_scans else 0.0
        scans_over_time.append(ChartScansOverTimeItem(date=day.isoformat(), scans=count_scans, accuracy=acc))

    # User growth (global)
    user_growth: List[ChartUserGrowthItem] = []
    for item in scans_over_time:
        users = db.query(func.count(User.id)).scalar() or 0
        # Calculer les utilisateurs actifs basés sur les scans de ce jour
        day_date = datetime.fromisoformat(item.date).date()
        next_day = day_date + timedelta(days=1)
        active_users = (
            db.query(func.count(func.distinct(PlantScan.user_id)))
            .filter(
                PlantScan.scan_date >= datetime.combine(day_date, datetime.min.time()),
                PlantScan.scan_date < datetime.combine(next_day, datetime.min.time()),
            )
            .scalar()
            or 0
        )
        user_growth.append(ChartUserGrowthItem(date=item.date, users=users, activeUsers=active_users))

    # Disease detections (top diseases with simple accuracy proxy) - global
    from app.models.scan import ScanDisease
    disease_rows = (
        db.query(Disease.name, func.count(ScanDisease.id).label("count"))
        .join(ScanDisease, ScanDisease.disease_id == Disease.id)
        .join(PlantScan, PlantScan.id == ScanDisease.scan_id)
        .filter(PlantScan.scan_date >= start_date)
        .group_by(Disease.name)
        .order_by(func.count(ScanDisease.id).desc())
        .limit(10)
        .all()
    )
    disease_detections = [
        ChartDiseaseDetectionsItem(disease=name, count=count, accuracy=0.7) for name, count in disease_rows
    ]

    system_metrics = ChartSystemMetrics(
        cpuUsage=0.35,
        memoryUsage=0.62,
        diskUsage=0.5,
        activeConnections=5,
    )

    return DashboardChartDataResponse(
        scansOverTime=scans_over_time,
        userGrowth=user_growth,
        diseaseDetections=disease_detections,
        systemMetrics=system_metrics,
    )


@router.get("/recent-activity", response_model=List[DashboardRecentActivityItem])
def get_recent_activity(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Vérifier les droits d'administrateur
    verify_admin_access(current_user)
    
    # Activités globales (tous les utilisateurs)
    activities = (
        db.query(Activity)
        .order_by(Activity.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        DashboardRecentActivityItem(
            id=a.id,
            title=a.title,
            description=a.description or "",
            time=a.created_at.isoformat() if a.created_at else "",
            type=a.type,
        )
        for a in activities
    ]


