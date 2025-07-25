import numpy as np
from typing import Dict, List, Optional
import logging
from datetime import datetime

from .model_loader import model_loader
from .image_preprocessor import image_preprocessor
import google.generativeai as genai
from app.core.config import settings
logger = logging.getLogger(__name__)

class PredictionService:
    """Service de prédiction utilisant le modèle ML chargé"""
    
    def __init__(self):
        """Initialise le service avec la clé API de Gemini."""
        try:
            # Configurez l'API Gemini avec votre clé
            genai.configure(api_key=settings.gemini_api_key)
            # Créez le modèle
            self.model = genai.GenerativeModel('gemini-1.5-flash-latest')
            logger.info("Service de recommandation initialisé avec succès.")
        except Exception as e:
            logger.error(f"Erreur lors de l'initialisation du modèle Gemini: {e}")
            self.model = None
        self.confidence_threshold = 0.7
        self.top_k_predictions = 3
        
    def set_confidence_threshold(self, threshold: float):
        """Définit le seuil de confiance minimum"""
        if 0.0 <= threshold <= 1.0:
            self.confidence_threshold = threshold
        else:
            raise ValueError("Le seuil de confiance doit être entre 0 et 1")
    
    def predict_raw(self, processed_image: np.ndarray) -> np.ndarray:
        """Effectue la prédiction brute avec le modèle"""
        try:
            if not model_loader.model_loaded or model_loader.model is None:
                raise RuntimeError("Le modèle n'est pas chargé")
            
            # Prédiction avec le modèle TensorFlow
            predictions = model_loader.model.predict(processed_image, verbose=0)
            
            # Vérifier la forme de sortie
            if len(predictions.shape) != 2:
                raise ValueError(f"Forme de prédiction inattendue: {predictions.shape}")
            
            return predictions[0]  # Retourner les probabilités pour le premier (et seul) échantillon
            
        except Exception as e:
            logger.error(f"Erreur lors de la prédiction brute: {str(e)}")
            raise RuntimeError(f"Échec de la prédiction: {str(e)}")
    
    def get_top_predictions(self, probabilities: np.ndarray) -> List[Dict]:
        """Extrait les top K prédictions"""
        try:
            top_predictions = []
            
            # Obtenir les indices triés par probabilité décroissante
            top_indices = np.argsort(probabilities)[::-1][:self.top_k_predictions]
            
            for rank, idx in enumerate(top_indices):
                if idx < len(model_loader.class_names):
                    class_name = model_loader.class_names[idx]
                    confidence = float(probabilities[idx])
                    
                    top_predictions.append({
                        "class_name": class_name,
                        "confidence": confidence,
                        "rank": rank + 1,
                        "class_index": int(idx)
                    })
            
            return top_predictions
            
        except Exception as e:
            logger.error(f"Erreur lors de l'extraction des top prédictions: {str(e)}")
            return []
    
    def determine_result_type(self, predicted_class: str, confidence: float) -> str:
        """Détermine le type de résultat basé sur la prédiction"""
        try:
            # Vérifier le seuil de confiance
            if confidence < self.confidence_threshold:
                return "unknown"
            
            # Mots-clés pour identifier les plantes saines
            healthy_keywords = ["healthy", "sain", "normal", "good", "bonne", "santé"]
            predicted_lower = predicted_class.lower()
            
            if any(keyword in predicted_lower for keyword in healthy_keywords):
                return "healthy"
            
            return "diseased"
            
        except Exception as e:
            logger.error(f"Erreur lors de la détermination du type de résultat: {str(e)}")
            return "unknown"
    
    def _get_disease_specific_recommendations(self, disease_name: str) -> str:
        """
        Génère des recommandations spécifiques pour une maladie en utilisant l'API Gemini.
        """
        if not self.model:
            return "Le service de recommandation n'est pas disponible pour le moment."

        # 1. Créer un prompt clair et détaillé pour l'API
        prompt = (
            f"Fournis des recommandations concises pour un agriculteur afin de traiter et prévenir la maladie '{disease_name}'. "
            "Organise la réponse en deux sections claires et distinctes :\n"
            "1. **Traitements suggérés** (incluant des options biologiques et chimiques si possible).\n"
            "2. **Mesures préventives** (actions pour éviter de futures infections).\n"
            "La réponse doit être en français, directe et facile à comprendre."
        )

        try:
            # 2. Appeler l'API Gemini pour générer le contenu
            response = self.model.generate_content(prompt)
            
            if response and response.text:
                # 3. Retourner la réponse formatée
                return f"Recommandations spécifiques pour: {disease_name}\n\n{response.text}"
            else:
                # 4. Gérer une réponse vide
                logger.warning(f"Aucune recommandation générée par l'API pour '{disease_name}'.")
                return f"Aucune recommandation spécifique n'a pu être trouvée pour '{disease_name}'."

        except Exception as e:
            # 4. Gérer les erreurs de l'API
            logger.error(f"Erreur lors de l'appel à l'API Gemini pour '{disease_name}': {str(e)}")
            return "Erreur lors de la récupération des recommandations spécifiques."

    def generate_recommendations(self, predicted_class: str, confidence: float, result_type: str, top_predictions:list) -> str:
        """Génère des recommandations personnalisées basées sur le résultat de la détection."""
        try:
            if result_type == "unknown":
                return (
                    f"Confiance faible ({confidence:.1%}). "
                    "Recommandations pour améliorer la détection:\n"
                    "• Prenez une photo plus claire avec un bon éclairage naturel\n"
                    "• Focalisez sur les feuilles présentant des symptômes\n"
                    "• Évitez les photos floues ou trop sombres"
                )
            
            if result_type == "healthy":
                return (
                    f"Plante en bonne santé détectée ({confidence:.1%}).\n"
                    "Recommandations de maintenance:\n"
                    "• Continuez vos soins habituels\n"
                    "• Surveillez régulièrement l'apparition de nouveaux symptômes"
                )
            
            if result_type == "diseased":
                base_recommendations = (
                    f"Maladie détectée: {predicted_class} (confiance: {confidence:.1%})\n\n"
                    "Mesures immédiates:\n"
                    "• Isolez la plante pour éviter la propagation\n"
                    "• Retirez les parties visiblement affectées avec des outils désinfectés\n"
                    "• Améliorez la ventilation autour de la plante\n\n"
                )
                
                # Appel à la fonction dynamique
                disease_specific = self._get_disease_specific_recommendations(predicted_class)
                
                return base_recommendations + disease_specific
            
            return "Aucune recommandation spécifique disponible."
        
        except Exception as e:
            logger.error(f"Erreur lors de la génération des recommandations: {str(e)}")
            return "Erreur critique lors de la génération des recommandations."
        

    def predict(self, image_bytes: bytes) -> Dict:
        """Pipeline complet de prédiction"""
        try:
            start_time = datetime.now()
            
            # Étape 1: Prétraitement de l'image
            logger.debug("Début du prétraitement de l'image")
            processed_image = image_preprocessor.preprocess(image_bytes)
            
            # Étape 2: Prédiction brute
            logger.debug("Début de la prédiction")
            probabilities = self.predict_raw(processed_image)
            
            # Étape 3: Extraction des résultats
            predicted_class_index = np.argmax(probabilities)
            confidence = float(probabilities[predicted_class_index])
            
            if predicted_class_index < len(model_loader.class_names):
                predicted_class = model_loader.class_names[predicted_class_index]
            else:
                predicted_class = "Classe inconnue"
            
            # Étape 4: Top prédictions
            top_predictions = self.get_top_predictions(probabilities)
            
            # Étape 5: Détermination du type de résultat
            result_type = self.determine_result_type(predicted_class, confidence)
            
            # Étape 6: Génération des recommandations
            recommendations = self.generate_recommendations(
                predicted_class, confidence, result_type, top_predictions
            )
            
            # Calcul du temps de traitement
            processing_time = (datetime.now() - start_time).total_seconds()
            
            logger.info(f"Prédiction terminée: {predicted_class} ({confidence:.3f}) en {processing_time:.2f}s")
            
            return {
                "predicted_class": predicted_class,
                "confidence": confidence,
                "result_type": result_type,
                "top_predictions": top_predictions,
                "recommendations": recommendations,
                "processing_time": processing_time,
                "model_version": "1.0",
                "timestamp": datetime.now().isoformat(),
            }
            
        except Exception as e:
            logger.error(f"Erreur dans le pipeline de prédiction: {str(e)}")
            raise RuntimeError(f"Échec de la prédiction: {str(e)}")
    
    def get_service_info(self) -> Dict:
        """Retourne les informations sur le service de prédiction"""
        return {
            "confidence_threshold": self.confidence_threshold,
            "top_k_predictions": self.top_k_predictions,
            "model_info": model_loader.get_model_info(),
            "preprocessor_info": image_preprocessor.get_preprocessing_info()
        }

# Instance globale du service de prédiction
prediction_service = PredictionService()
