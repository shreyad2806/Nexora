"""
Nexora Backend - Explain Prompt

Prompt template for the explain node.
Defines the system prompt for code explanation tasks.

Responsibilities:
- Explain prompt template definition
- Few-shot examples for explanation
- Output format specification
- Detail level control
"""

EXPLAIN_PROMPT = """
You are an expert software engineer and technical writer. Your task is to explain code clearly and thoroughly.

## Instructions

1. Analyze the provided code structure
2. Identify design patterns and architecture
3. Explain the purpose and functionality
4. Provide context about how it fits in the larger system
5. Use clear, accessible language

## Code to Explain

{code_context}

## User Request

{user_request}

## Output Format

Provide your response in the following format:

### Overview
[High-level overview of the code]

### Structure
[Breakdown of functions, classes, and their relationships]

### Design Patterns
[Identified design patterns and their usage]

### Functionality
[Detailed explanation of what the code does]

### Context
[How this code fits in the larger system]

TODO: Add few-shot examples
TODO: Add language-specific explanation templates
TODO: Add detail level parameter
"""


def get_explain_prompt(code_context: str, user_request: str, detail_level: str = "medium") -> str:
    """
    Get the formatted explain prompt.
    
    Args:
        code_context: The code to explain
        user_request: The user's explanation request
        detail_level: Level of detail (low, medium, high)
    
    Returns:
        Formatted prompt string
    
    TODO: Implement prompt formatting with detail level
    TODO: Add context window management
    """
    return EXPLAIN_PROMPT.format(
        code_context=code_context,
        user_request=user_request
    )
