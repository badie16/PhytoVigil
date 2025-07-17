from typing import Dict
import logging

from app.ml.model_loader import model_loader
from app.ml.prediction_service import prediction_service

logger = logging.getLogger(__name__)

class MLService:
    """Service principal ML qui orchestre tous les composants"""
    
    def __init__(self):
        self.initialized = False
    
    def initialize(self) -> bool:
        """Initialise tous les composants ML"""
        try:
            logger.info("🚀 Initialisation du service ML...")
            
            # Initialiser le chargeur de modèle
            success = model_loader.initialize()
            
            if success:
                self.initialized = True
                logger.info("✅ Service ML initialisé avec succès")
            else:
                self.initialized = False
                logger.error("❌ Échec de l'initialisation du service ML")
            
            return self.initialized
            
        except Exception as e:
            logger.error(f"Erreur lors de l'initialisation du service ML: {str(e)}")
            self.initialized = False
            return False
    
    def predict(self, image_bytes: bytes) -> Dict:
        """Effectue une prédiction sur une image"""
        if not self.initialized:
            raise RuntimeError("Le service ML n'est pas initialisé")
        
        return prediction_service.predict(image_bytes)
    
    def get_status(self) -> Dict:
        """Retourne le statut complet du service ML"""
        return {
            "service_initialized": self.initialized,
            "model_loaded": model_loader.model_loaded,
            "model_info": model_loader.get_model_info(),
            "prediction_service_info": prediction_service.get_service_info()
        }
    
    @property
    def model_loaded(self) -> bool:
        """Propriété pour vérifier si le modèle est chargé"""
        return self.initialized and model_loader.model_loaded
    
    @property
    def class_names(self) -> list:
        """Propriété pour accéder aux noms de classes"""
        return model_loader.class_names

# Instance globale du service ML
ml_service = MLService()

# Initialisation automatique au démarrage
ml_service.initialize()
