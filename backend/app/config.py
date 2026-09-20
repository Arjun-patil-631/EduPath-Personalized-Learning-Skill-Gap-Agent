import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "EduPath API"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # SQLite default database path
    DATABASE_URL: str = "sqlite:///./edupath.db"
    
    # CORS Origins for frontend communication
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://0.0.0.0:3000",
    ]
    
    # Execution Sandbox settings
    EXECUTION_TIMEOUT_SECONDS: float = 5.0
    
    # Default session user for prototype alignment
    DEFAULT_USER_ID: str = "usr_948271"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
