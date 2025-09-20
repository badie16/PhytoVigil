from pydantic import BaseModel
from typing import Optional, List

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


class DashboardScansByDayItem(BaseModel):
    name: str
    scans: int
    correct: int


class DashboardDiseaseDistributionItem(BaseModel):
    name: str
    value: int
    color: str


class DashboardMonthlyGrowthItem(BaseModel):
    month: str
    users: int
    scans: int


class DashboardRecentActivityItem(BaseModel):
    id: str
    title: str
    description: str
    time: str
    type: str


class DashboardStatsResponse(BaseModel):
    totalScans: int
    totalUsers: int
    totalDiseases: int
    accuracy: float
    scansByDay: List[DashboardScansByDayItem]
    diseaseDistribution: List[DashboardDiseaseDistributionItem]
    monthlyGrowth: List[DashboardMonthlyGrowthItem]
    recentActivity: List[DashboardRecentActivityItem]


class ChartScansOverTimeItem(BaseModel):
    date: str
    scans: int
    accuracy: float


class ChartUserGrowthItem(BaseModel):
    date: str
    users: int
    activeUsers: int


class ChartDiseaseDetectionsItem(BaseModel):
    disease: str
    count: int
    accuracy: float


class ChartSystemMetrics(BaseModel):
    cpuUsage: float
    memoryUsage: float
    diskUsage: float
    activeConnections: int


class DashboardChartDataResponse(BaseModel):
    scansOverTime: List[ChartScansOverTimeItem]
    userGrowth: List[ChartUserGrowthItem]
    diseaseDetections: List[ChartDiseaseDetectionsItem]
    systemMetrics: ChartSystemMetrics
