from sqlalchemy import Column, Integer, String, Date, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Plant(Base):
    __tablename__ = "plants"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    type = Column(String(100))
    variety = Column(String(100))
    planted_date = Column(Date)
    location = Column(String(255))
    notes = Column(Text)
    image_url = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relations
    user = relationship("User", back_populates="plants")
    scans = relationship("PlantScan", back_populates="plant", cascade="all, delete-orphan")
