import os
import json
import tensorflow as tf
from typing import Optional, List
import logging

logger = logging.getLogger(__name__)

class ModelLoader:
    """Gestionnaire de chargement et de configuration du modèle ML"""
    
    def __init__(self):
        self.model: Optional[tf.keras.Model] = None
        self.class_names: List[str] = []
        self.model_loaded: bool = False
        self.model_path: str = ""
        self.class_names_path: str = ""
        
    def configure_paths(self, model_path: str = None, class_names_path: str = None):
        """Configure les chemins vers le modèle et les classes"""
        if model_path is None:
            self.model_path = os.path.join("app", "ml", "plant_disease_model.h5")
        else:
            self.model_path = model_path
            
        if class_names_path is None:
            self.class_names_path = os.path.join("app", "ml", "class_names.json")
        else:
            self.class_names_path = class_names_path
    
    def load_model(self) -> bool:
        """Charge le modèle TensorFlow"""
        try:
            if not os.path.exists(self.model_path):
                logger.error(f"Modèle non trouvé à {self.model_path}")
                return False
            
            # Charger le modèle avec gestion des erreurs TensorFlow
            self.model = tf.keras.models.load_model(
                self.model_path,
                compile=False  # Évite les erreurs de compilation
            )
            
            logger.info(f"✅ Modèle TensorFlow chargé depuis {self.model_path}")
            logger.info(f"Architecture du modèle: {self.model.input_shape} -> {self.model.output_shape}")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur lors du chargement du modèle: {str(e)}")
            self.model = None
            return False
    
    def load_class_names(self) -> bool:
        """Charge les noms des classes depuis le fichier JSON"""
        try:
            if not os.path.exists(self.class_names_path):
                logger.error(f"Fichier class_names.json non trouvé à {self.class_names_path}")
                return False
            
            with open(self.class_names_path, 'r', encoding='utf-8') as f:
                self.class_names = json.load(f)
            
            logger.info(f"✅ {len(self.class_names)} classes chargées")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur lors du chargement des classes: {str(e)}")
            self.class_names = []
            return False
    
    def initialize(self) -> bool:
        """Initialise complètement le modèle et les classes"""
        self.configure_paths()
        
        model_loaded = self.load_model()
        classes_loaded = self.load_class_names()
        
        self.model_loaded = model_loaded and classes_loaded
        
        if self.model_loaded:
            logger.info("🚀 Modèle ML initialisé avec succès")
        else:
            logger.warning("⚠️ Échec de l'initialisation du modèle ML")
        
        return self.model_loaded
    
    def get_model_info(self) -> dict:
        """Retourne les informations sur le modèle chargé"""
        if not self.model_loaded:
            return {"status": "not_loaded", "error": "Modèle non chargé"}
        
        return {
            "status": "loaded",
            "model_path": self.model_path,
            "input_shape": str(self.model.input_shape) if self.model else None,
            "output_shape": str(self.model.output_shape) if self.model else None,
            "classes_count": len(self.class_names),
            "model_loaded": self.model_loaded
        }
    
    def validate_model(self) -> bool:
        """Valide que le modèle est prêt pour les prédictions"""
        if not self.model_loaded or self.model is None:
            return False
        
        try:
            # Test avec une image factice
            import numpy as np
            test_input = np.random.random((1, 224, 224, 3)).astype(np.float32)
            _ = self.model.predict(test_input, verbose=0)
            return True
        except Exception as e:
            logger.error(f"Validation du modèle échouée: {str(e)}")
            return False

# Instance globale du chargeur de modèle
model_loader = ModelLoader()
