import numpy as np
from PIL import Image, ImageOps
import io
from typing import Tuple, Optional
import logging

logger = logging.getLogger(__name__)

class ImagePreprocessor:
    """Gestionnaire de prétraitement des images pour le modèle ML"""
    
    def __init__(self, target_size: Tuple[int, int] = (224, 224)):
        self.target_size = target_size
        self.supported_formats = {'JPEG', 'PNG', 'JPG', 'WEBP', 'BMP'}
    
    def validate_image(self, image_bytes: bytes) -> bool:
        """Valide qu'un fichier est une image supportée"""
        try:
            image = Image.open(io.BytesIO(image_bytes))
            return image.format in self.supported_formats
        except Exception:
            return False
    
    def resize_image(self, image: Image.Image) -> Image.Image:
        """Redimensionne l'image à la taille cible"""
        try:
            # Utiliser LANCZOS pour un redimensionnement de qualité
            resized_image = image.resize(self.target_size, Image.Resampling.LANCZOS)
            return resized_image
        except Exception as e:
            logger.error(f"Erreur lors du redimensionnement: {str(e)}")
            raise ValueError(f"Impossible de redimensionner l'image: {str(e)}")
    
    def normalize_image(self, image_array: np.ndarray) -> np.ndarray:
        """Normalise les valeurs des pixels (0-255 -> 0-1)"""
        try:
            # Convertir en float32 et normaliser
            normalized = image_array.astype(np.float32) / 255.0
            
            # Vérifier les valeurs
            if np.any(normalized < 0) or np.any(normalized > 1):
                logger.warning("Valeurs de pixels hors de la plage [0,1] après normalisation")
            
            return normalized
        except Exception as e:
            logger.error(f"Erreur lors de la normalisation: {str(e)}")
            raise ValueError(f"Impossible de normaliser l'image: {str(e)}")
    
    def convert_to_rgb(self, image: Image.Image) -> Image.Image:
        """Convertit l'image en mode RGB"""
        try:
            if image.mode != 'RGB':
                # Gérer les différents modes d'image
                if image.mode == 'RGBA':
                    # Créer un fond blanc pour les images avec transparence
                    background = Image.new('RGB', image.size, (255, 255, 255))
                    background.paste(image, mask=image.split()[-1])  # Utiliser le canal alpha
                    return background
                else:
                    return image.convert('RGB')
            return image
        except Exception as e:
            logger.error(f"Erreur lors de la conversion RGB: {str(e)}")
            raise ValueError(f"Impossible de convertir l'image en RGB: {str(e)}")
    
    def enhance_image(self, image: Image.Image) -> Image.Image:
        """Améliore la qualité de l'image (optionnel)"""
        try:
            # Auto-orientation basée sur les métadonnées EXIF
            image = ImageOps.exif_transpose(image)
            
            # Égalisation automatique des couleurs (optionnel)
            # image = ImageOps.autocontrast(image)
            
            return image
        except Exception as e:
            logger.warning(f"Amélioration d'image échouée: {str(e)}")
            return image  # Retourner l'image originale en cas d'erreur
    
    def add_batch_dimension(self, image_array: np.ndarray) -> np.ndarray:
        """Ajoute la dimension batch pour la prédiction"""
        try:
            if len(image_array.shape) == 3:
                return np.expand_dims(image_array, axis=0)
            elif len(image_array.shape) == 4 and image_array.shape[0] == 1:
                return image_array
            else:
                raise ValueError(f"Forme d'image inattendue: {image_array.shape}")
        except Exception as e:
            logger.error(f"Erreur lors de l'ajout de la dimension batch: {str(e)}")
            raise ValueError(f"Impossible d'ajouter la dimension batch: {str(e)}")
    
    def preprocess(self, image_bytes: bytes) -> np.ndarray:
        """Pipeline complet de prétraitement d'image"""
        try:
            # Étape 1: Validation
            if not self.validate_image(image_bytes):
                raise ValueError("Format d'image non supporté")
            
            # Étape 2: Ouverture de l'image
            image = Image.open(io.BytesIO(image_bytes))
            logger.debug(f"Image originale: {image.size}, mode: {image.mode}")
            
            # Étape 3: Amélioration (orientation, etc.)
            image = self.enhance_image(image)
            
            # Étape 4: Conversion en RGB
            image = self.convert_to_rgb(image)
            
            # Étape 5: Redimensionnement
            image = self.resize_image(image)
            
            # Étape 6: Conversion en array numpy
            image_array = np.array(image)
            logger.debug(f"Array shape après conversion: {image_array.shape}")
            
            # Étape 7: Normalisation
            image_array = self.normalize_image(image_array)
            
            # Étape 8: Ajout de la dimension batch
            image_array = self.add_batch_dimension(image_array)
            
            logger.debug(f"Image prétraitée: {image_array.shape}, dtype: {image_array.dtype}")
            return image_array
            
        except Exception as e:
            logger.error(f"Erreur dans le pipeline de prétraitement: {str(e)}")
            raise ValueError(f"Échec du prétraitement de l'image: {str(e)}")
    
    def get_preprocessing_info(self) -> dict:
        """Retourne les informations sur la configuration du préprocesseur"""
        return {
            "target_size": self.target_size,
            "supported_formats": list(self.supported_formats),
            "normalization": "0-255 -> 0-1",
            "color_mode": "RGB"
        }

# Instance globale du préprocesseur
image_preprocessor = ImagePreprocessor()
