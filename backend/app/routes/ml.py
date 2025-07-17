from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import Optional
import json

from app.database import get_db
from app.models.user import User
from app.models.scan import PlantScan, ScanDisease
from app.models.disease import Disease
from app.schemas.ml import (
    PredictionRequest, PredictionResponse, PredictionError, 
    ModelStatus, ClassesResponse, ServiceStatus
)
from app.schemas.scan import PlantScanCreate
from app.services.ml_service import ml_service
from app.services.file_service import FileService
from app.core.security import get_current_user
from app.crud.scan import create_scan, create_scan_disease

router = APIRouter()
file_service = FileService()

@router.post("/predict", response_model=PredictionResponse)
async def predict_disease(
    image: UploadFile = File(...),
    plant_id: Optional[int] = Form(None),
    location_lat: Optional[float] = Form(None),
    location_lng: Optional[float] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyse une image de plante pour détecter des maladies
    """
    try:
        # Vérifier que le service ML est disponible
        if not ml_service.model_loaded:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Le service de détection n'est pas disponible"
            )
        
        # Valider le fichier image
        if not image.content_type or not image.content_type.startswith('image/'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le fichier doit être une image"
            )
        
        # Vérifier la taille du fichier (max 10MB)
        max_size = 10 * 1024 * 1024  # 10MB
        image_bytes = await image.read()
        
        if len(image_bytes) > max_size:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="L'image est trop volumineuse (max 10MB)"
            )
        
       # Recharger l'objet UploadFile
        image.file.seek(0)  # Revenir au début

        # Créer le dossier de destination
        folder_path = f"users/{current_user.id}/scans"

        image_url = await file_service.upload_image(
            file=image,
            bucket_name="scan",
            folder_path=folder_path
        )
        
        # Effectuer la prédiction
        prediction_result = ml_service.predict(image_bytes)
        
        # Créer l'enregistrement du scan
        scan_data = {
            "plant_id": plant_id,
            "image_url": image_url,
            "result_type": prediction_result["result_type"],
            "confidence_score": prediction_result["confidence"],
            "recommendations": prediction_result["recommendations"],
            "location_lat": location_lat,
            "location_lng": location_lng,
            "detected_diseases": prediction_result["top_predictions"]
        }
        
        scan = create_scan(db, scan_data, current_user.id)
        
        # Si une maladie est détectée, créer les enregistrements scan_diseases
        if prediction_result["result_type"] == "diseased":
            # Chercher la maladie dans la base de données
            print("yes diseased")
            disease = db.query(Disease).filter(
                Disease.name.ilike(f"%{prediction_result['predicted_class']}%")
            ).first()
            
            if disease:
                print("the diseased is in the database")
                scan_disease_data = {                    
                    "disease_id": disease.id,
                    "confidence_score": prediction_result["confidence"],
                    "affected_area_percentage": None
                }                
                create_scan_disease(db, scan_disease_data,scan.id)        
        # Préparer la réponse
        response = PredictionResponse(
            scan_id=scan.id,
            user_id=scan.user_id,
            predicted_class=prediction_result["predicted_class"],
            confidence=prediction_result["confidence"],
            result_type=prediction_result["result_type"],
            top_predictions=prediction_result["top_predictions"],
            recommendations=prediction_result["recommendations"],
            image_url=image_url,
            scan_date=scan.scan_date,
            model_version=prediction_result["model_version"],
            processing_time=prediction_result.get("processing_time")
        )
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de l'analyse: {str(e)}"
        )

@router.get("/status", response_model=ServiceStatus)
async def get_service_status():
    """
    Retourne le statut complet du service ML
    """
    try:
        status_info = ml_service.get_status()
        
        return ServiceStatus(
            service_initialized=status_info["service_initialized"],
            model_loaded=status_info["model_loaded"],
            confidence_threshold=status_info["prediction_service_info"]["confidence_threshold"],
            supported_formats=status_info["prediction_service_info"]["preprocessor_info"]["supported_formats"],
            target_image_size=list(status_info["prediction_service_info"]["preprocessor_info"]["target_size"]),
            processing_info=status_info
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la récupération du statut: {str(e)}"
        )

@router.get("/model/status", response_model=ModelStatus)
async def get_model_status():
    """
    Retourne le statut du modèle ML
    """
    try:
        status_info = ml_service.get_status()
        model_info = status_info["model_info"]
        
        return ModelStatus(
            model_loaded=ml_service.model_loaded,
            model_version="1.0",
            classes_count=len(ml_service.class_names),
            status="ready" if ml_service.model_loaded else "not_loaded",
            model_info=model_info
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la récupération du statut du modèle: {str(e)}"
        )

@router.get("/classes", response_model=ClassesResponse)
async def get_available_classes():
    """
    Retourne la liste des classes que le modèle peut détecter
    """
    if not ml_service.model_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Le modèle n'est pas chargé"
        )
    
    try:
        classes = ml_service.class_names
        
        return ClassesResponse(
            classes=classes,
            count=len(classes)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors de la récupération des classes: {str(e)}"
        )

@router.post("/model/reload")
async def reload_model():
    """
    Recharge le modèle ML (admin seulement)
    """
    try:
        success = ml_service.initialize()
        
        if success:
            return {"message": "Modèle rechargé avec succès", "status": "success"}
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Échec du rechargement du modèle"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Erreur lors du rechargement: {str(e)}"
        )
