from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Activity(Base):
    __tablename__ = "activities"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)  # scan, plant_added, treatment, disease_detected, etc.
    title = Column(String(255), nullable=False)
    description = Column(Text)
    plant_id = Column(Integer, ForeignKey("plants.id", ondelete="CASCADE"))
    scan_id = Column(Integer, ForeignKey("plant_scans.id", ondelete="CASCADE"))
    status = Column(String(50), default="active")  # active, archived, dismissed
    meta_data = Column(JSON)  # Additional data like disease info, treatment details, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relations
    user = relationship("User", back_populates="activities")
    plant = relationship("Plant", back_populates="activities")
    scan = relationship("PlantScan", back_populates="activities")
