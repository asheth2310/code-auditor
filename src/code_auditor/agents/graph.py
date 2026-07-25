"""LangGraph orchestration — assembles the multi-agent audit pipeline."""
import logging
from langgraph.graph import StateGraph, START, END
from typing import Any, Dict

# Assuming these are imported from the rest of the project
from ..state import AuditorState
from .auditor import auditor_node
from .exploit import exploit_node
from .patcher import patcher_node
from .pr_creator import pr_creator_node
from ..sandbox import DockerSandbox
from ..config import get_settings

from ..github_service import GitHubService

logger = logging.getLogger(__name__)


def clone_repo(state: Any) -> dict:
    """Clones the repo and reads source files into state."""
    settings = get_settings()
    gh = GitHubService(token=settings.github_token)
    repo_name = state["repo_name"]

    logger.info(f"Cloning repository {repo_name}...")
    import tempfile
    clone_path = tempfile.mkdtemp(prefix="audit_")
    gh.clone_repo(repo_name, clone_path)

    source_files = gh.read_source_files(clone_path, extensions=(".py",))
    logger.info(f"Read {len(source_files)} Python files from {repo_name}")

    return {
        "clone_path": clone_path,
        "source_files": source_files,
        "event_log": [f"[CloneRepo] Cloned {repo_name}, found {len(source_files)} Python files"],
    }


def select_vuln(state: Any) -> dict:
    """Picks the next vulnerability from the list and resets patch attempts."""
    idx = state.get("current_vuln_index", 0)
    vulns = state.get("vulnerabilities", [])
    if idx < len(vulns):
        vuln = vulns[idx]
        logger.info(f"Selected vulnerability {idx + 1}/{len(vulns)}: {vuln.get('vuln_type')}")
        return {
            "current_vuln": vuln,
            "patch_attempts": 0,
            "event_log": [f"[SelectVuln] Processing vuln {idx + 1}/{len(vulns)}: {vuln.get('vuln_type')} in {vuln.get('file_path')}"],
        }
    return {}


def run_exploit_sandbox(state: Any) -> dict:
    """Runs the exploit test in Docker sandbox. Expects test to FAIL (exit_code != 0) to confirm vulnerability."""
    settings = get_settings()
    sandbox = DockerSandbox(image_name=settings.docker_image, timeout=settings.sandbox_timeout)

    test_code = state.get("exploit_test_code", "")
    source_files = state.get("source_files", {})

    logger.info("Running exploit test in sandbox...")
    result = sandbox.run_pytest(test_code, source_files, timeout=settings.sandbox_timeout)

    return {
        "sandbox_exit_code": result["exit_code"],
        "sandbox_stdout": result["stdout"],
        "sandbox_stderr": result["stderr"],
        "event_log": [f"[ExploitSandbox] exit_code={result['exit_code']}, status={result['status']}"],
    }


def verify_patch_sandbox(state: Any) -> dict:
    """Runs exploit test with patched code in sandbox. Expects test to PASS (exit_code == 0) confirming fix."""
    settings = get_settings()
    sandbox = DockerSandbox(image_name=settings.docker_image, timeout=settings.sandbox_timeout)

    test_code = state.get("exploit_test_code", "")
    source_files = dict(state.get("source_files", {}))

    # Overlay the patched file onto source files
    vuln = state.get("current_vuln")
    if vuln and state.get("patch_code"):
        source_files[vuln["file_path"]] = state["patch_code"]

    logger.info("Verifying patch in sandbox...")
    result = sandbox.run_pytest(test_code, source_files, timeout=settings.sandbox_timeout)

    return {
        "sandbox_exit_code": result["exit_code"],
        "sandbox_stdout": result["stdout"],
        "sandbox_stderr": result["stderr"],
        "event_log": [f"[VerifySandbox] exit_code={result['exit_code']}, status={result['status']}, attempt={state.get('patch_attempts', 0)}"],
    }


def next_vuln(state: Any) -> dict:
    """Increments current_vuln_index to process the next vulnerability."""
    idx = state.get("current_vuln_index", 0) + 1
    logger.info(f"Moving to vulnerability index {idx}")
    return {
        "current_vuln_index": idx,
        "current_vuln": None,
        "event_log": [f"[NextVuln] Advanced to vulnerability index {idx}"],
    }

def build_graph() -> Any:
    """Builds and compiles the auditor pipeline graph."""
    workflow = StateGraph(AuditorState)
    
    # Add nodes
    workflow.add_node("clone_repo", clone_repo)
    workflow.add_node("audit", auditor_node)
    workflow.add_node("select_vuln", select_vuln)
    workflow.add_node("generate_exploit", exploit_node)
    workflow.add_node("run_exploit_sandbox", run_exploit_sandbox)
    workflow.add_node("generate_patch", patcher_node)
    workflow.add_node("verify_patch_sandbox", verify_patch_sandbox)
    workflow.add_node("create_pr", pr_creator_node)
    workflow.add_node("next_vuln", next_vuln)
    
    # Define edges
    workflow.add_edge(START, "clone_repo")
    workflow.add_edge("clone_repo", "audit")
    
    def after_audit(state: Any) -> str:
        if not state.get("vulnerabilities"):
            return "end"
        return "continue"
        
    workflow.add_conditional_edges(
        "audit",
        after_audit,
        {"end": END, "continue": "select_vuln"}
    )
    
    workflow.add_edge("select_vuln", "generate_exploit")
    workflow.add_edge("generate_exploit", "run_exploit_sandbox")
    
    def after_run_exploit(state: Any) -> str:
        if state.get("sandbox_exit_code", 0) != 0:
            return "patch"
        return "next"
        
    workflow.add_conditional_edges(
        "run_exploit_sandbox",
        after_run_exploit,
        {"patch": "generate_patch", "next": "next_vuln"}
    )
    
    workflow.add_edge("generate_patch", "verify_patch_sandbox")
    
    def after_verify_patch(state: Any) -> str:
        if state.get("sandbox_exit_code", -1) == 0:
            return "create_pr"
        if state.get("patch_attempts", 0) >= state.get("max_retries", 3):
            return "next"
        return "retry"
        
    workflow.add_conditional_edges(
        "verify_patch_sandbox",
        after_verify_patch,
        {"create_pr": "create_pr", "next": "next_vuln", "retry": "generate_patch"}
    )
    
    workflow.add_edge("create_pr", "next_vuln")
    
    def after_next_vuln(state: Any) -> str:
        if state.get("current_vuln_index", 0) < len(state.get("vulnerabilities", [])):
            return "continue"
        return "end"
        
    workflow.add_conditional_edges(
        "next_vuln",
        after_next_vuln,
        {"continue": "select_vuln", "end": END}
    )
    
    return workflow.compile()
