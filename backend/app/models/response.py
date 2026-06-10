"""
Nexora Backend - Response Models

Pydantic models for API responses.
Defines the schema for outgoing API responses.

Responsibilities:
- Response validation
- Type safety
- Documentation generation
- Consistent response structure
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class DebugResponse(BaseModel):
    """Response model for code debugging endpoint."""
    
    issues: List[str] = Field(default_factory=list, description="List of found issues")
    root_cause: Optional[str] = Field(None, description="Root cause analysis")
    suggestions: List[str] = Field(default_factory=list, description="Fix suggestions")
    diffs: List[str] = Field(default_factory=list, description="Code diffs")
    confidence: Optional[float] = Field(None, description="Confidence score")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")
    
    # TODO: Add issue severity levels
    # TODO: Add estimated fix time


class ExplainResponse(BaseModel):
    """Response model for code explanation endpoint."""
    
    overview: Optional[str] = Field(None, description="High-level overview")
    structure: Optional[Dict[str, Any]] = Field(None, description="Code structure")
    design_patterns: List[str] = Field(default_factory=list, description="Design patterns")
    functionality: Optional[str] = Field(None, description="Detailed functionality explanation")
    context: Optional[str] = Field(None, description="System context")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")
    
    # TODO: Add code examples
    # TODO: Add related documentation links


class OptimizeResponse(BaseModel):
    """Response model for code optimization endpoint."""
    
    performance_analysis: Optional[Dict[str, Any]] = Field(
        None,
        description="Performance analysis results"
    )
    suggestions: List[str] = Field(default_factory=list, description="Optimization suggestions")
    refactoring: List[str] = Field(default_factory=list, description="Refactoring opportunities")
    diffs: List[str] = Field(default_factory=list, description="Code diffs")
    best_practices: List[str] = Field(default_factory=list, description="Best practices")
    expected_impact: Optional[str] = Field(None, description="Expected performance impact")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")
    
    # TODO: Add benchmark results
    # TODO: Add before/after metrics


class ChatResponse(BaseModel):
    """Response model for chat endpoint."""
    
    message: str = Field(..., description="AI response message")
    conversation_id: Optional[str] = Field(None, description="Conversation ID")
    suggestions: Optional[List[str]] = Field(None, description="Code suggestions if applicable")
    diffs: Optional[List[str]] = Field(None, description="Code diffs if applicable")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Additional metadata")
    
    # TODO: Add streaming support
    # TODO: Add action suggestions (apply diff, etc.)


class ErrorResponse(BaseModel):
    """Standard error response model."""
    
    error: str = Field(..., description="Error message")
    error_type: Optional[str] = Field(None, description="Error type")
    details: Optional[Dict[str, Any]] = Field(None, description="Error details")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Error timestamp")
