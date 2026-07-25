from typing import TypedDict, Annotated, List, Optional, Dict, Any
from operator import add

class Vulnerability(TypedDict):
    """Represents a single detected vulnerability."""
    file_path: str
    line_range: str
    vuln_type: str
    severity: str  # critical, high, medium, low
    description: str
    source_code: str

class AuditorState(TypedDict):
    """Shared state for the multi-agent code auditor pipeline."""
    # Repository info
    repo_url: str
    repo_name: str
    clone_path: str
    source_files: Dict[str, str]  # {file_path: content}
    
    # Vulnerability tracking
    vulnerabilities: List[Vulnerability]
    current_vuln_index: int
    current_vuln: Optional[Vulnerability]
    
    # Agent outputs
    exploit_test_code: str
    patch_code: str
    patched_file_path: str
    
    # Sandbox results
    sandbox_stdout: str
    sandbox_stderr: str
    sandbox_exit_code: int
    
    # Retry & control flow
    patch_attempts: int
    max_retries: int
    
    # Results
    pr_urls: Annotated[List[str], add]  # Accumulates PR URLs
    event_log: Annotated[List[str], add]  # Accumulates log entries
    status: str  # running, completed, failed
    error: Optional[str]
