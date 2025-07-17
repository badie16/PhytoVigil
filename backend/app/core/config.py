import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Base de données
    database_url: str = os.getenv("DATABASE_URL", "")
    
    # JWT
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))
    
    # Fichiers
    upload_dir: str = os.getenv("UPLOAD_DIR", "uploads/") 
    max_file_size: int = int(os.getenv("MAX_FILE_SIZE", "10485760"))  # 10MB
    allowed_extensions: List[str] = os.getenv("ALLOWED_EXTENSIONS", "jpg,jpeg,png,webp").split(",")

    # API pour Gemini (Google AI)
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")


    # Supabase Storage
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_key: str = os.getenv("SUPABASE_KEY", "")
    
    # CORS
    allowed_origins: List[str] = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    
    # Environnement
    environment: str = os.getenv("ENVIRONMENT", "development")
    debug: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    class Config:
        env_file = ".env"

settings = Settings()
