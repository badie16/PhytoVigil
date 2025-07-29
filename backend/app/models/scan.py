from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Numeric, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class PlantScan(Base):
    __tablename__ = "plant_scans"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    plant_id = Column(Integer, ForeignKey("plants.id", ondelete="CASCADE"))
    image_url = Column(String(500), nullable=False)
    result_type = Column(String(50))  # 'healthy', 'diseased', 'unknown'
    confidence_score = Column(Numeric(5, 4))
    detected_diseases = Column(JSON)
    recommendations = Column(Text)
    scan_date = Column(DateTime(timezone=True), server_default=func.now())
    location_lat = Column(Numeric(10, 8))
    location_lng = Column(Numeric(11, 8))
    
    # Relations
    user = relationship("User", back_populates="scans")
    plant = relationship("Plant", back_populates="scans")
    scan_diseases = relationship("ScanDisease", back_populates="scan", cascade="all, delete-orphan")
    activities = relationship("Activity", back_populates="scan", cascade="all, delete-orphan")
class ScanDisease(Base):
    __tablename__ = "scan_diseases"
    
    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("plant_scans.id", ondelete="CASCADE"), nullable=False)
    disease_id = Column(Integer, ForeignKey("diseases.id", ondelete="CASCADE"), nullable=False)
    confidence_score = Column(Numeric(5, 4))
    affected_area_percentage = Column(Numeric(5, 2))
    
    # Relations
    scan = relationship("PlantScan", back_populates="scan_diseases")
    disease = relationship("Disease", back_populates="scan_diseases")
