from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class PredictionRequest(BaseModel):
    """Schéma de requête pour la prédiction"""
    plant_id: Optional[int] = Field(None, description="ID de la plante (optionnel)")
    location_lat: Optional[float] = Field(None, ge=-90, le=90, description="Latitude GPS")
    location_lng: Optional[float] = Field(None, ge=-180, le=180, description="Longitude GPS")

class TopPrediction(BaseModel):
    """Schéma pour une prédiction individuelle"""
    class_name: str = Field(..., description="Nom de la classe prédite")
    confidence: float = Field(..., ge=0, le=1, description="Score de confiance")
    rank: int = Field(..., ge=1, description="Rang de la prédiction")
    class_index: Optional[int] = Field(None, description="Index de la classe")

class PredictionResponse(BaseModel):
    """Schéma de réponse pour la prédiction"""
    predicted_class: str = Field(..., description="Classe prédite principale")
    confidence: float = Field(..., ge=0, le=1, description="Score de confiance principal")
    result_type: str = Field(..., description="Type de résultat: healthy, diseased, unknown")
    top_predictions: List[TopPrediction] = Field(..., description="Top 3 des prédictions")
    recommendations: str = Field(..., description="Recommandations générées")
    image: str = Field(..., description="URL de l'image uploadée")
    scan_date: datetime = Field(..., description="Date et heure du scan")
    model_version: str = Field(..., description="Version du modèle utilisé")
    processing_time: Optional[float] = Field(None, description="Temps de traitement en secondes")

class PredictionError(BaseModel):
    """Schéma d'erreur pour les prédictions"""
    error_code: str = Field(..., description="Code d'erreur")
    error_message: str = Field(..., description="Message d'erreur")
    details: Optional[Dict[str, Any]] = Field(None, description="Détails supplémentaires")

class ModelStatus(BaseModel):
    """Schéma pour le statut du modèle"""
    model_loaded: bool = Field(..., description="Modèle chargé ou non")
    model_version: str = Field(..., description="Version du modèle")
    classes_count: int = Field(..., description="Nombre de classes")
    status: str = Field(..., description="Statut général")
    model_info: Optional[Dict[str, Any]] = Field(None, description="Informations détaillées")

class ClassInfo(BaseModel):
    """Schéma pour les informations sur une classe"""
    class_name: str = Field(..., description="Nom de la classe")
    class_index: int = Field(..., description="Index de la classe")
    category: Optional[str] = Field(None, description="Catégorie (plante, maladie)")

class ClassesResponse(BaseModel):
    """Schéma de réponse pour la liste des classes"""
    classes: List[str] = Field(..., description="Liste des noms de classes")
    classes_info: Optional[List[ClassInfo]] = Field(None, description="Informations détaillées")
    count: int = Field(..., description="Nombre total de classes")

class ServiceStatus(BaseModel):
    """Schéma pour le statut complet du service ML"""
    service_initialized: bool = Field(..., description="Service initialisé")
    model_loaded: bool = Field(..., description="Modèle chargé")
    confidence_threshold: float = Field(..., description="Seuil de confiance")
    supported_formats: List[str] = Field(..., description="Formats d'image supportés")
    target_image_size: List[int] = Field(..., description="Taille d'image cible")
    processing_info: Optional[Dict[str, Any]] = Field(None, description="Informations de traitement")
