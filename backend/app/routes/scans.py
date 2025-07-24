from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.disease import Disease
from app.models.user import User
from app.schemas.scan import PlantScan, PlantScanCreate, PlantScanUpdate
from app.core.security import get_current_user
from app.services.file_service import FileService
from app.services.ml_service import ml_service
from app.crud import scan as crud_scan
from app.crud.scan import create_scan, create_scan_disease

router = APIRouter()
file_service = FileService()

@router.get("/", response_model=List[PlantScan])
def get_user_scans(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer tous les scans de l'utilisateur connecté"""
    scans = crud_scan.get_scans_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return scans

@router.get("/{scan_id}", response_model=PlantScan)
def get_scan(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer un scan spécifique"""
    scan = crud_scan.get_scan(db, scan_id=scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan non trouvé")
    if scan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    return scan

@router.get("/plants/{plant_id}/scans", response_model=List[PlantScan])
def get_plant_scans(
    plant_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Récupérer tous les scans d'une plante spécifique"""
    # Vérifier que la plante appartient à l'utilisateur
    from app.crud import plant as crud_plant
    plant = crud_plant.get_plant(db, plant_id=plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail="Plante non trouvée")
    if plant.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    scans = crud_scan.get_scans_by_plant(db, plant_id=plant_id, skip=skip, limit=limit)
    return scans

@router.post("/", response_model=PlantScan, status_code=status.HTTP_201_CREATED)
async def upload_scan(
    image: UploadFile = File(...),
    plant_id: Optional[int] = Form(None),
    location_lat: Optional[float] = Form(None),
    location_lng: Optional[float] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Créer un nouveau scan"""
    try:
        # Si plant_id est fourni, vérifier que la plante appartient à l'utilisateur
        if plant_id:
            from app.crud import plant as crud_plant
            plant = crud_plant.get_plant(db, plant_id=plant_id)
            if not plant:
                raise HTTPException(status_code=404, detail="Plante non trouvée")
            if plant.user_id != current_user.id:
                raise HTTPException(status_code=403, detail="Accès non autorisé")
            
        image_bytes = await image.read()
        if len(image_bytes) > 10 * 1024 * 1024:
            raise HTTPException(413, "Image trop volumineuse")
        
        image.file.seek(0)
        # Créer le dossier de destination
        folder_path = f"users/{current_user.id}/scans"

        image_url = await file_service.upload_image(
            file=image,
            bucket_name="scan",
            folder_path=folder_path
        )
    
        # Prédiction
        prediction_result = ml_service.predict(image_bytes)
        scan_data = {
            "plant_id": plant_id,
            "image_url": image_url,
            "result_type": prediction_result["result_type"],
            "confidence_score": prediction_result["confidence"],
            "recommendations": prediction_result["recommendations"],
            "location_lat": location_lat,
            "location_lng": location_lng,
            "detected_diseases": prediction_result["top_predictions"],
        }
        scan =  create_scan(db, scan_data, current_user.id)
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
        return scan
    except Exception as e:
        raise HTTPException(500, f"Erreur lors de l'analyse et du stockage: {str(e)}")

@router.put("/{scan_id}", response_model=PlantScan)
def update_scan(
    scan_id: int,
    scan_update: PlantScanUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mettre à jour un scan"""
    scan = crud_scan.get_scan(db, scan_id=scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan non trouvé")
    if scan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    updated_scan = crud_scan.update_scan(db=db, scan_id=scan_id, scan_update=scan_update)
    return updated_scan

@router.delete("/{scan_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scan(
    scan_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprimer un scan"""
    scan = crud_scan.get_scan(db, scan_id=scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan non trouvé")
    if scan.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    success = crud_scan.delete_scan(db=db, scan_id=scan_id)
    if not success:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression")
