from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import JSONResponse, FileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.security import get_current_user
from app.services.file_service import file_service
from app.core.config import settings # Pour accéder aux noms de buckets
from pydantic import HttpUrl
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Définir les noms de buckets Supabase
PLANTS_BUCKET = "plant"
SCANS_BUCKET = "scan"
DISEASES_BUCKET = "disease"

@router.post("/upload/plant_image", response_model=HttpUrl)
async def upload_plant_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Upload une image de plante vers Supabase Storage.
    Retourne l'URL publique de l'image.
    """
    try:
        # Les images de plantes sont stockées dans un dossier par utilisateur
        folder_path = f"users/{current_user.id}/plants"
        image_url = await file_service.upload_image(file, PLANTS_BUCKET, folder_path)
        return image_url
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Erreur lors de l'upload de l'image de plante: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to upload plant image.")
    
    
@router.post("/upload/scan_image", response_model=HttpUrl)
async def upload_scan_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Upload une image de scan vers Supabase Storage.
    Retourne l'URL publique de l'image.
    """
    try:
        # Les images de scan sont stockées dans un dossier par utilisateur
        folder_path = f"users/{current_user.id}/scans"
        image_url = await file_service.upload_image(file, SCANS_BUCKET, folder_path)
        return image_url
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Erreur lors de l'upload de l'image de scan: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to upload scan image.")

@router.post("/upload/disease_image", response_model=HttpUrl, dependencies=[Depends(get_current_user)])
async def upload_disease_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Upload une image de maladie vers Supabase Storage (Admin seulement).
    Retourne l'URL publique de l'image.
    """
    # Cette route devrait être protégée par un rôle admin si nécessaire
    # Pour l'instant, elle est accessible par tout utilisateur authentifié
    # La vérification du rôle admin est dans get_current_admin_user si vous l'ajoutez
    try:
        folder_path = "diseases" # Les images de maladies sont globales
        image_url = await file_service.upload_image(file, DISEASES_BUCKET, folder_path)
        return image_url
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Erreur lors de l'upload de l'image de maladie: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to upload disease image.")

@router.delete("/delete", status_code=status.HTTP_204_NO_CONTENT)
async def delete_image(
    image_url: HttpUrl,
    bucket_name: str, # Ex: "plant", "scan", "disease"
    current_user: User = Depends(get_current_user)
):
    """
    Supprime une image de Supabase Storage.
    L'utilisateur doit être le propriétaire de l'image ou un admin.
    """
    # TODO: Implémenter une logique de vérification de propriété plus robuste
    # Pour l'instant, tout utilisateur authentifié peut demander la suppression
    # Il faudrait vérifier que l'image_url appartient bien à l'utilisateur ou que l'utilisateur est admin.
    try:
        success = await file_service.delete_image(bucket_name, str(image_url))
        if not success:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found or could not be deleted.")
        return {"message": "Image deleted successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        logger.error(f"Erreur lors de la suppression de l'image {image_url}: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to delete image.")
