"""
Nexora Backend - Graph State Management

Defines the state schema for LangGraph workflows.
State is passed between nodes and accumulates information.

Responsibilities:
- State schema definition
- Type safety for state fields
- State validation
- State serialization/deserialization
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class GraphState(BaseModel):
    """
    Main state object for LangGraph workflows.
    This state is passed between nodes and accumulates results.
    
    Fields:
        user_request: The original user request/message
        code_context: Current code context (file contents, selection)
        workspace_context: Information about the workspace structure
        memory_context: Retrieved memory from previous interactions
        analysis: Analysis results from nodes
        suggestions: Code suggestions and recommendations
        diff: Generated code diffs
        error: Error information if any
        metadata: Additional metadata
    """
    
    # Input fields
    user_request: str = Field(default="", description="User's original request")
    code_context: Optional[str] = Field(default=None, description="Current code context")
    file_path: Optional[str] = Field(default=None, description="Path to the current file")
    workspace_root: Optional[str] = Field(default=None, description="Root of the workspace")
    
    # Context fields (populated by nodes)
    workspace_context: Optional[Dict[str, Any]] = Field(
        default=None, 
        description="Workspace structure and context"
    )
    memory_context: Optional[List[Dict[str, Any]]] = Field(
        default=None, 
        description="Retrieved memory from vector store"
    )
    
    # Output fields (populated by specialized nodes)
    analysis: Optional[str] = Field(default=None, description="Code analysis results")
    suggestions: Optional[List[str]] = Field(
        default=None, 
        description="Code suggestions and recommendations"
    )
    diff: Optional[str] = Field(default=None, description="Generated code diff")
    explanation: Optional[str] = Field(default=None, description="Code explanation")
    
    # Error handling
    error: Optional[str] = Field(default=None, description="Error message if execution failed")
    
    # Metadata
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional metadata for tracking and debugging"
    )
    
    # Node tracking
    current_node: Optional[str] = Field(default=None, description="Currently executing node")
    node_history: List[str] = Field(
        default_factory=list,
        description="History of executed nodes"
    )
    
    class Config:
        arbitrary_types_allowed = True
