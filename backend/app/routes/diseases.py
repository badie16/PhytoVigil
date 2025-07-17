from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.schemas.disease import Disease, DiseaseCreate, DiseaseUpdate
from app.crud import disease as crud_disease
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[Disease])
def get_diseases(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Récupérer toutes les maladies"""
    diseases = crud_disease.get_diseases(db, skip=skip, limit=limit)
    return diseases

@router.get("/{disease_id}", response_model=Disease)
def get_disease(
    disease_id: int,
    db: Session = Depends(get_db)
):
    """Récupérer une maladie spécifique"""
    disease = crud_disease.get_disease(db, disease_id=disease_id)
    if not disease:
        raise HTTPException(status_code=404, detail="Maladie non trouvée")
    return disease

@router.get("/name/{disease_name}", response_model=Disease)
def get_disease_by_name(
    disease_name: str,
    db: Session = Depends(get_db)
):
    """Récupérer une maladie par son nom"""
    disease = crud_disease.get_disease_by_name(db, name=disease_name)
    if not disease:
        raise HTTPException(status_code=404, detail="Maladie non trouvée")
    return disease

@router.post("/", response_model=Disease, status_code=status.HTTP_201_CREATED)
def create_disease(
    disease: DiseaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Créer une nouvelle maladie (admin seulement)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    # Vérifier si la maladie existe déjà
    existing_disease = crud_disease.get_disease_by_name(db, name=disease.name)
    if existing_disease:
        raise HTTPException(status_code=400, detail="Cette maladie existe déjà")
    
    return crud_disease.create_disease(db=db, disease=disease)

@router.put("/{disease_id}", response_model=Disease)
def update_disease(
    disease_id: int,
    disease_update: DiseaseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mettre à jour une maladie (admin seulement)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    disease = crud_disease.get_disease(db, disease_id=disease_id)
    if not disease:
        raise HTTPException(status_code=404, detail="Maladie non trouvée")
    
    updated_disease = crud_disease.update_disease(db=db, disease_id=disease_id, disease_update=disease_update)
    return updated_disease

@router.delete("/{disease_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_disease(
    disease_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Supprimer une maladie (admin seulement)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Accès non autorisé")
    
    disease = crud_disease.get_disease(db, disease_id=disease_id)
    if not disease:
        raise HTTPException(status_code=404, detail="Maladie non trouvée")
    
    success = crud_disease.delete_disease(db=db, disease_id=disease_id)
    if not success:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression")
