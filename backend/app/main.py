import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import get_db, engine, Base
from app.routes import auth, user, plants, diseases, scans, files,ml,stats
from app.core.config import settings # Importez les paramètres de configuration
from app.core.security import get_current_user


app = FastAPI(
    title="PhytoVigil API",
    description="API pour la détection de maladies des plantes et la gestion des utilisateurs.",
    version="0.1.0",
    debug=settings.debug # Utilise le paramètre de débogage
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    # allow_origins=settings.allowed_origins, # Utilise les origines autorisées des paramètres
    allow_origins=["*"],# tout les origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routeurs
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(user.router, prefix="/api/users", tags=["Users"])
app.include_router(plants.router, prefix="/api/plants", tags=["Plants"])
app.include_router(diseases.router, prefix="/api/diseases", tags=["Diseases"])
app.include_router(scans.router, prefix="/api/scans", tags=["Scans"])
app.include_router(files.router, prefix="/api/files", tags=["File Uploads"]) 
app.include_router(ml.router, prefix="/api/ml", tags=["Machine Learning"])
app.include_router(stats.router, prefix="/api/stats", tags=["Statistics"])

@app.get("/")
async def root():
    return  {
        "message": "Welcome to the PhytoVigil API",
        "version": "1.0.0"
        }

# Exemple de route protégée pour tester
@app.get("/protected-route")
async def protected_route(current_user: user = Depends(get_current_user)):
    return {"message": f"Hello {current_user.email}, you are authenticated!"}

