"""Auditor Agent — performs static security analysis on source code."""
import json
import logging
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from ..state import AuditorState
from ..config import get_settings

logger = logging.getLogger(__name__)

AUDIT_SYSTEM_PROMPT = """You are a senior application security engineer performing a static security audit.
Analyze the provided source code for security vulnerabilities.

Focus on these vulnerability categories:
- SQL Injection (string concatenation in queries)
- Command Injection (unsanitized os.system, subprocess calls)
- Path Traversal (unvalidated file paths)
- Unsafe Deserialization (yaml.load without SafeLoader, pickle.loads on untrusted data)
- Cross-Site Scripting (XSS) in web templates
- Missing Authentication/Authorization checks
- Hardcoded secrets or credentials

For each vulnerability found, respond with a JSON array of objects:
[
  {
    "file_path": "relative/path/to/file.py",
    "line_range": "10-15",
    "vuln_type": "sql_injection",
    "severity": "critical",
    "description": "User input is directly concatenated into SQL query...",
    "source_code": "the vulnerable code snippet"
  }
]

If no vulnerabilities are found, return an empty array: []
RESPOND ONLY WITH THE JSON ARRAY. No markdown, no explanation."""


def _get_llm():
    """Create LLM using GitHub Models inference endpoint."""
    settings = get_settings()
    return ChatOpenAI(
        model="openai/gpt-4o",
        api_key=settings.github_models_token,
        base_url="https://models.github.ai/inference/v1",
        temperature=0,
    )


def auditor_node(state: AuditorState) -> dict:
    """LangGraph node that audits source code for security vulnerabilities."""
    logger.info("Auditor agent starting analysis...")
    
    source_files = state["source_files"]
    
    # Build source code context — limit to ~6000 tokens (~24000 chars) for GitHub Models
    code_context = ""
    char_limit = 24000
    files_included = 0
    for file_path, content in source_files.items():
        entry = f"\n--- FILE: {file_path} ---\n{content}\n"
        if len(code_context) + len(entry) > char_limit:
            break
        code_context += entry
        files_included += 1
    
    if files_included == 0 and source_files:
        # At least include one file, truncated
        first_path = next(iter(source_files))
        code_context = f"\n--- FILE: {first_path} ---\n{source_files[first_path][:char_limit]}\n"
        files_included = 1
    
    llm = _get_llm()
    
    messages = [
        SystemMessage(content=AUDIT_SYSTEM_PROMPT),
        HumanMessage(content=f"Analyze the following codebase for security vulnerabilities:\n{code_context}")
    ]
    
    response = llm.invoke(messages)
    
    try:
        content = response.content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[1]
            content = content.rsplit("```", 1)[0]
        vulnerabilities = json.loads(content)
    except (json.JSONDecodeError, Exception) as e:
        logger.error(f"Failed to parse auditor response: {e}")
        vulnerabilities = []
    
    logger.info(f"Found {len(vulnerabilities)} vulnerabilities")
    
    return {
        "vulnerabilities": vulnerabilities,
        "current_vuln_index": 0,
        "event_log": [f"[Auditor] Scanned {files_included}/{len(source_files)} files, found {len(vulnerabilities)} vulnerabilities"]
    }
