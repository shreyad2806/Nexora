"""
Nexora Backend - Request Models

Pydantic models for API requests.
Defines the schema for incoming API requests.

Responsibilities:
- Request validation
- Type safety
- Documentation generation
- Default value handling
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class DebugRequest(BaseModel):
    """Request model for code debugging endpoint."""
    
    code: str = Field(..., description="Code to debug")
    file_path: Optional[str] = Field(None, description="Path to the file")
    language: Optional[str] = Field(None, description="Programming language")
    context: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="Additional context"
    )
    
    # TODO: Add selection range for partial file debugging
    # TODO: Add error message if debugging specific error


class ExplainRequest(BaseModel):
    """Request model for code explanation endpoint."""
    
    code: str = Field(..., description="Code to explain")
    file_path: Optional[str] = Field(None, description="Path to the file")
    language: Optional[str] = Field(None, description="Programming language")
    detail_level: Optional[str] = Field(
        "medium",
        description="Level of detail (low, medium, high)"
    )
    context: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="Additional context"
    )
    
    # TODO: Add focus areas (architecture, patterns, specific functions)


class OptimizeRequest(BaseModel):
    """Request model for code optimization endpoint."""
    
    code: str = Field(..., description="Code to optimize")
    file_path: Optional[str] = Field(None, description="Path to the file")
    language: Optional[str] = Field(None, description="Programming language")
    optimization_type: Optional[str] = Field(
        "performance",
        description="Type of optimization (performance, readability, maintainability)"
    )
    context: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="Additional context"
    )
    
    # TODO: Add constraints (maintain API compatibility, etc.)
    # TODO: Add benchmarking options


class ChatRequest(BaseModel):
    """Request model for chat endpoint."""
    
    message: str = Field(..., description="User message")
    conversation_id: Optional[str] = Field(None, description="Conversation ID")
    context: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="Current context (file, selection, etc.)"
    )
    
    # TODO: Add streaming option
    # TODO: Add model selection
