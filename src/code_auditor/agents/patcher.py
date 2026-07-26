"""Patch Agent."""
import logging
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage
from ..state import AuditorState
from ..config import get_settings

logger = logging.getLogger(__name__)

PATCHER_SYSTEM_PROMPT = """You are a security engineer. Fix the vulnerability in the provided source code.
Return ONLY the complete fixed source file. No markdown, no explanation."""

def patcher_node(state: AuditorState) -> dict:
    """LangGraph node that attempts to patch the vulnerability."""
    logger.info("Patcher agent generating fix...")
    vulnerabilities = state.get("vulnerabilities", [])
    current_idx = state.get("current_vuln_index", 0)
    
    if current_idx >= len(vulnerabilities):
        return {"patch_code": "", "event_log": ["[Patcher] No vulnerability to patch."]}
        
    current_vuln = vulnerabilities[current_idx]
    file_path = current_vuln.get("file_path", "")
    source_files = state.get("source_files", {})
    source_code = source_files.get(file_path, "")
    patch_attempts = state.get("patch_attempts", 0)
    sandbox_stderr = state.get("sandbox_stderr", "")
    
    settings = get_settings()
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=settings.google_api_key,
        temperature=0,
    )
    
    prompt = f"Vulnerability Details:\n{current_vuln}\n\nOriginal Source Code:\n{source_code}"
    if patch_attempts > 0 and sandbox_stderr:
        prompt += f"\n\nPrevious patch attempt failed with sandbox error output:\n{sandbox_stderr}\nFix the issue and provide the complete corrected source code."
        
    messages = [
        SystemMessage(content=PATCHER_SYSTEM_PROMPT),
        HumanMessage(content=prompt)
    ]
    
    response = llm.invoke(messages)
    content = response.content.strip()
    
    # Strip markdown fences if present
    if content.startswith("```"):
        content = content.split("\n", 1)[1]
        content = content.rsplit("```", 1)[0]
    if content.startswith("python\n"):
        content = content[7:]
        
    logger.info(f"Patch generated. Attempt {patch_attempts + 1}.")
    return {
        "patch_code": content.strip(),
        "patch_attempts": patch_attempts + 1,
        "event_log": [f"[Patcher] Generated fix for {current_vuln.get('vuln_type', 'unknown')} in {file_path} (Attempt {patch_attempts + 1})"]
    }
