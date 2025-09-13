import numpy as np
from typing import Dict, List, Optional
import logging
from datetime import datetime
import json
import re

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

    def _normalize_disease_name(self, name: str) -> str:
        # Remove special characters and replace spaces with underscores
        name = re.sub(r'[^\w\s]', '', name)  # Remove everything except letters, numbers, spaces
        name = re.sub(r'\s+', '_', name)     # Replace spaces with underscores
        return name
    def _get_disease_specific_recommendations(self, disease_name: str) -> dict:
        """
        Generates disease-specific recommendations using the Gemini API.
        Returns a Python dict (JSON serializable).
        """
        if not self.model:
            return {
                "disease": disease_name,
                "treatments": [],
                "preventive_measures": [],
                "error": "The recommendation service is currently unavailable."
            }

        prompt = (
            f"Generate a JSON object ONLY, with no extra text, for the disease '{disease_name}'.\n"
            "The JSON must follow this structure exactly:\n"
            "{\n"
            '  "disease": "<name>",\n'
            '  "treatments": ["<treatment1>", "<treatment2>", "..."],\n'
            '  "preventive_measures": ["<measure1>", "<measure2>", "..."]\n'
            "}\n"
            "Requirements:\n"
            "- Only return the JSON object inside the curly braces {}.\n"
            "- Do not include any markdown, code blocks, or extra text outside {}.\n"
            "- Keep all recommendations clear, and safe for farmers.\n"
            "- Each treatment and preventive measure should be a single string.\n"
        )

        try:
            response = self.model.generate_content(prompt)

            if response and response.text:
                try:
                    data = json.loads(response.text)
                    data["disease"] = self._normalize_disease_name(data["disease"])                    
                    return data
                except json.JSONDecodeError:
                    logger.warning(f"Invalid JSON returned by API for '{disease_name}': {response.text}")
                    return {
                        "disease": disease_name,
                        "treatments": [],
                        "preventive_measures": [],
                        "error": "Invalid JSON returned by API"
                    }
            else:
                return {
                    "disease": disease_name,
                    "treatments": [],
                    "preventive_measures": [],
                    "error": "No response from API"
                }

        except Exception as e:
            logger.error(f"Error while calling Gemini API for '{disease_name}': {str(e)}")
            return {
                "disease": disease_name,
                "treatments": [],
                "preventive_measures": [],
                "error": "Exception occurred during API call"
            }
    
    def generate_recommendations(self, predicted_class: str, confidence: float, result_type: str, top_predictions: list) -> dict:
        """
        Generates personalized recommendations based on detection results.
        Returns a JSON serializable dict.
        """
        try:
            if result_type == "unknown":
                return {
                    "status": "unknown",
                    "confidence": confidence,
                    "tips": [
                        "Take a clearer photo with good natural lighting",
                        "Focus on leaves showing visible symptoms",
                        "Avoid blurry or overly dark images"
                    ]
                }

            if result_type == "healthy":
                return {
                    "status": "healthy",
                    "confidence": confidence,
                    "advice": [
                        "Continue regular care",
                        "Monitor for the appearance of new symptoms"
                    ]
                }

            if result_type == "diseased":
                base_recommendations = [
                    "Isolate the plant to prevent spread",
                    "Remove visibly affected parts using disinfected tools",
                    "Improve airflow around the plant"
                ]

                # Append disease-specific recommendations
                disease_specific = self._get_disease_specific_recommendations(predicted_class)

                return {
                    "status": "diseased",
                    "confidence": confidence,
                    "disease": predicted_class,
                    "immediate_actions": base_recommendations,
                    "recommendations": disease_specific
                }

            return {"status": "unknown", "confidence": confidence, "error": "No specific recommendations available."}

        except Exception as e:
            logger.error(f"Error while generating recommendations: {str(e)}")
            return {"status": "error", "error": "Critical error occurred while generating recommendations."}

    

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
