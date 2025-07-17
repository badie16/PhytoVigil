from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Disease(Base):
    __tablename__ = "diseases"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    scientific_name = Column(String(255))
    description = Column(Text)
    symptoms = Column(Text)
    treatment = Column(Text)
    prevention = Column(Text)
    severity_level = Column(Integer)
    image_url = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relations
    scan_diseases = relationship("ScanDisease", back_populates="disease")
