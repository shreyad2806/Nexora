"""
Nexora Backend - Configuration Module

Centralized configuration management using Pydantic settings.
Loads configuration from environment variables and .env files.

Responsibilities:
- Environment variable parsing and validation
- Database connection settings
- LLM provider configuration (OpenAI/Ollama)
- Vector store configuration
- Application settings (host, port, debug mode)
"""

from pydantic_settings import BaseSettings
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    APP_NAME: str = "Nexora"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "vscode-webview://*"]
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "nexora.log"
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/nexora"
    
    # Vector Store
    VECTOR_STORE_DIMENSION: int = 1536
    VECTOR_STORE_COLLECTION: str = "nexora_memory"
    
    # LLM Configuration
    LLM_PROVIDER: str = "openai"  # or "ollama"
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-small"
    
    # Ollama Configuration
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3"
    
    # LangGraph
    MAX_ITERATIONS: int = 50
    TIMEOUT_SECONDS: int = 300
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """
    Cached settings instance.
    Ensures settings are loaded only once and reused across the application.
    """
    return Settings()


settings = get_settings()
