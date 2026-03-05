import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "UrbanShield AI"
    API_VERSION: str = "v3"
    MODEL_VERSION: str = "Hybrid-Climate-3.0"
    
    # Model configuration
    # V3 Structure: models is sibling to app
    MODEL_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
    
    # Demo and Safety settings
    DEMO_MODE: bool = False
    CACHE_TTL_SECONDS: int = 600  # 10 minutes
    
    # Internal metrics
    UPTIME_START: float = 0.0
    
    class Config:
        env_file = ".env"

settings = Settings()
