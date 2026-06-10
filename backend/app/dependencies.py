"""
Nexora Backend - Dependency Injection

Provides dependency injection for FastAPI routes.
Manages shared resources and services across the application.

Responsibilities:
- Database session management
- LLM service initialization
- Vector store and memory service injection
- Authentication and authorization dependencies
"""

from fastapi import Depends
from typing import Optional

from app.config import settings


# TODO: Uncomment when services are implemented
# from app.services.llm_service import LLMService
# from app.services.embedding_service import EmbeddingService
# from app.memory.postgres import get_db_session
# from app.memory.vector_store import VectorStore


async def get_llm_service() -> Optional[object]:
    """
    Dependency for LLM service instance.
    
    Returns:
        LLM service instance (None until implemented)
    
    TODO: Implement singleton pattern for LLM service
    TODO: Support multiple LLM providers (OpenAI, Ollama, etc.)
    """
    # TODO: Initialize and return LLM service
    return None


async def get_embedding_service() -> Optional[object]:
    """
    Dependency for embedding service instance.
    
    Returns:
        Embedding service instance (None until implemented)
    
    TODO: Implement singleton pattern for embedding service
    TODO: Configure embedding model based on settings
    """
    # TODO: Initialize and return embedding service
    return None


async def get_vector_store() -> Optional[object]:
    """
    Dependency for vector store instance.
    
    Returns:
        Vector store instance (None until implemented)
    
    TODO: Initialize vector store with pgvector
    TODO: Configure collection and index settings
    """
    # TODO: Initialize and return vector store
    return None


async def get_db() -> Optional[object]:
    """
    Dependency for database session.
    Provides a transactional session for each request.
    
    Returns:
        Database session (None until implemented)
    
    TODO: Implement database session management
    """
    # TODO: Implement database session
    return None
