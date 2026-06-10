"""
Nexora Backend - Main Entry Point

FastAPI application entry point for the Nexora backend service.
Initializes the application, registers routes, middleware, and starts the server.

Responsibilities:
- Application initialization and configuration
- Route registration
- CORS and middleware setup
- Lifespan event handlers (startup/shutdown)
- Logging configuration
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.routes import router
from app.api.health import health_router
from app.utils.logger import setup_logger


# Configure logging
logger = setup_logger(
    name="nexora",
    level=settings.LOG_LEVEL,
    log_file=settings.LOG_FILE
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for application startup and shutdown events.
    
    Handles resource initialization and cleanup for the application lifecycle.
    """
    # Startup logic
    logger.info("Starting Nexora Backend...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Debug mode: {settings.DEBUG}")
    
    # TODO: Initialize database connections
    # TODO: Initialize vector stores
    # TODO: Load LangGraph workflows
    # TODO: Set up monitoring
    
    yield
    
    # Shutdown logic
    logger.info("Shutting down Nexora Backend...")
    # TODO: Close database connections
    # TODO: Cleanup resources


# Create FastAPI application
app = FastAPI(
    title="Nexora API",
    description="Agentic AI Coding Assistant Backend",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)


# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register routers
app.include_router(router, prefix="/api/v1")
app.include_router(health_router, prefix="/health")


@app.get("/")
async def root():
    """
    Root endpoint for API health check.
    
    Returns:
        JSON response confirming the backend is running.
    """
    logger.debug("Root endpoint called")
    return {"message": "Nexora Backend Running"}


@app.get("/health")
async def health():
    """
    Health check endpoint.
    
    Returns:
        JSON response with health status.
    """
    logger.debug("Health check endpoint called")
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    
    logger.info(f"Starting server on {settings.HOST}:{settings.PORT}")
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )
