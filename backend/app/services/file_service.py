import os
from typing import Optional
from fastapi import UploadFile, HTTPException, status
from PIL import Image, ImageOps
import io
from supabase import create_client, Client
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class FileService:
    def __init__(self):
        self.supabase_url: str = settings.supabase_url
        self.supabase_key: str = settings.supabase_key
        self.supabase_client: Optional[Client] = None
        self._initialize_supabase_client()

    def _initialize_supabase_client(self):
        """Initialise le client Supabase."""
        if not self.supabase_url or not self.supabase_key:
            logger.error("SUPABASE_URL ou SUPABASE_KEY non définies. Le service de fichiers ne fonctionnera pas.")
            return
        try:
            self.supabase_client = create_client(self.supabase_url, self.supabase_key)
            logger.info("✅ Client Supabase initialisé.")
        except Exception as e:
            logger.error(f"❌ Erreur lors de l'initialisation du client Supabase: {e}")
            self.supabase_client = None

    async def upload_image(self, file: UploadFile, bucket_name: str, folder_path: str = "") -> str:
        """
        Upload une image vers Supabase Storage après optimisation.
        Retourne l'URL publique de l'image.
        """
        if not self.supabase_client:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Supabase client not initialized. Check backend configuration."
            )
        print(file)
        if not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Le fichier doit être une image."
            )

        try:
            contents = await file.read()
            image = Image.open(io.BytesIO(contents))

            # Correction de l'orientation EXIF
            image = ImageOps.exif_transpose(image)

            # Convertir en RGB si nécessaire
            if image.mode != 'RGB':
                image = image.convert('RGB')

            # Optimisation
            output_buffer = io.BytesIO()
            image.save(output_buffer, format="WEBP", quality=80)
            output_buffer.seek(0)

            # Définir le chemin de stockage
            file_extension = "webp"
            file_name = f"{os.urandom(16).hex()}.{file_extension}"
            storage_path = os.path.join(folder_path, file_name).replace("\\", "/")

            # Upload vers Supabase Storage
            res = self.supabase_client.storage.from_(bucket_name).upload(
                path=storage_path,
                file=output_buffer.getvalue(),
                file_options={"content-type": f"image/{file_extension}"}
            )

            if not res or not getattr(res, "path", None):
                logger.error("❌ Échec de l'upload de l'image vers Supabase.")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Upload failed: no path returned."
                )

            # Récupérer l'URL publique
            public_url = self.supabase_client.storage.from_(bucket_name).get_public_url(storage_path)

            if not public_url or not isinstance(public_url, str):
                logger.error("❌ Impossible d'obtenir l'URL publique.")
                raise HTTPException(status_code=500, detail="Failed to get public URL.")
            logger.info(f"✅ Image uploadée: {public_url}")
            return public_url

        except Exception as e:
            logger.error(f"❌ Erreur inattendue lors de l'upload de l'image: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to process and upload image: {str(e)}"
            )

    async def delete_image(self, bucket_name: str, file_path: str) -> bool:
        """
        Supprime un fichier de Supabase Storage.
        file_path doit être le chemin complet du fichier dans le bucket (ex: 'user_uploads/image.webp').
        """
        if not self.supabase_client:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Supabase client not initialized. Check backend configuration."
            )
        
        try:
            # Extraire le chemin du fichier relatif au bucket
            # Si l'URL est https://[project_id].supabase.co/storage/v1/object/public/[bucket_name]/[path/to/file.webp]
            # Nous avons besoin de [path/to/file.webp]
            
            # Trouver l'index du bucket_name dans l'URL pour extraire le chemin relatif
            parts = file_path.split(f'/{bucket_name}/')
            if len(parts) < 2:
                logger.warning(f"URL de fichier invalide pour la suppression: {file_path}")
                return False
            
            path_in_bucket = parts[1]

            res = self.supabase_client.storage.from_(bucket_name).remove([path_in_bucket])
            
            if res.data and res.data[0].get('name') == path_in_bucket:
                logger.info(f"✅ Image supprimée: {file_path}")
                return True
            elif res.error:
                logger.error(f"❌ Erreur lors de la suppression de l'image {file_path}: {res.error.message}")
                return False
            else:
                logger.warning(f"Image non trouvée ou non supprimée: {file_path}. Réponse: {res.data}")
                return False
        except Exception as e:
            logger.error(f"❌ Erreur inattendue lors de la suppression de l'image: {e}")
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to delete image: {e}")

# Instance globale du service de fichiers
file_service = FileService()
