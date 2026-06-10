"""
Nexora Backend - Debug Prompt

Prompt template for the debug node.
Defines the system prompt for code debugging tasks.

Responsibilities:
- Debug prompt template definition
- Few-shot examples for debugging
- Output format specification
- Context injection
"""

DEBUG_PROMPT = """
You are an expert code debugger and software engineer. Your task is to analyze code for bugs, errors, and potential issues.

## Instructions

1. Carefully analyze the provided code
2. Identify any bugs, errors, or potential issues
3. Explain the root cause of each issue
4. Provide specific fix suggestions
5. Generate code diffs for the suggested fixes

## Code to Debug

{code_context}

## User Request

{user_request}

## Output Format

Provide your response in the following format:

### Issues Found
- Issue 1: [description]
- Issue 2: [description]

### Root Cause Analysis
[Detailed explanation of root causes]

### Fix Suggestions
1. [Fix suggestion 1]
2. [Fix suggestion 2]

### Code Diffs
```diff
[diff format]
``]

TODO: Add few-shot examples
TODO: Add language-specific debugging instructions
TODO: Add output schema for structured parsing
"""


def get_debug_prompt(code_context: str, user_request: str) -> str:
    """
    Get the formatted debug prompt.
    
    Args:
        code_context: The code to debug
        user_request: The user's debugging request
    
    Returns:
        Formatted prompt string
    
    TODO: Implement prompt formatting
    TODO: Add context window management
    """
    return DEBUG_PROMPT.format(
        code_context=code_context,
        user_request=user_request
    )
