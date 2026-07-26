"""FastAPI server to expose the auditor pipeline to the frontend."""
import logging
import asyncio
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .agents.graph import build_graph
from .config import get_settings

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(name)s] %(levelname)s: %(message)s")

# Store running/completed audits
audits: dict = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown lifecycle."""
    logger.info("Code Auditor API starting up...")
    yield
    logger.info("Code Auditor API shutting down...")


app = FastAPI(
    title="Code Auditor API",
    description="Autonomous multi-agent security auditor",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AuditRequest(BaseModel):
    repo_name: str  # owner/repo format


class AuditResponse(BaseModel):
    audit_id: str
    status: str
    repo_name: str
    vulnerabilities: list = []
    pr_urls: list = []
    event_log: list = []
    error: Optional[str] = None


@app.get("/health")
async def health():
    return {"status": "ok", "service": "code-auditor"}


@app.post("/audit", response_model=AuditResponse)
async def start_audit(request: AuditRequest):
    """Start a new security audit on a GitHub repository."""
    import uuid
    
    audit_id = str(uuid.uuid4())[:8]
    repo_name = request.repo_name
    
    if not "/" in repo_name:
        raise HTTPException(status_code=400, detail="repo_name must be in owner/repo format")
    
    # Initialize audit state
    audits[audit_id] = {
        "audit_id": audit_id,
        "status": "running",
        "repo_name": repo_name,
        "vulnerabilities": [],
        "pr_urls": [],
        "event_log": [f"[System] Starting audit for {repo_name}..."],
        "error": None,
    }
    
    # Run the pipeline in a background task
    asyncio.create_task(_run_audit(audit_id, repo_name))
    
    return AuditResponse(**audits[audit_id])


@app.get("/audit/{audit_id}", response_model=AuditResponse)
async def get_audit(audit_id: str):
    """Get the status and results of an audit."""
    if audit_id not in audits:
        raise HTTPException(status_code=404, detail="Audit not found")
    return AuditResponse(**audits[audit_id])


@app.get("/audits")
async def list_audits():
    """List all audits."""
    return list(audits.values())


async def _run_audit(audit_id: str, repo_name: str):
    """Run the LangGraph pipeline in the background."""
    try:
        settings = get_settings()
        graph = build_graph()
        
        initial_state = {
            "repo_url": f"https://github.com/{repo_name}",
            "repo_name": repo_name,
            "clone_path": "",
            "source_files": {},
            "vulnerabilities": [],
            "current_vuln_index": 0,
            "current_vuln": None,
            "exploit_test_code": "",
            "patch_code": "",
            "patched_file_path": "",
            "sandbox_stdout": "",
            "sandbox_stderr": "",
            "sandbox_exit_code": -1,
            "patch_attempts": 0,
            "max_retries": settings.max_patch_retries,
            "pr_urls": [],
            "event_log": [],
            "status": "running",
            "error": None,
        }
        
        # Run synchronous graph in thread pool
        loop = asyncio.get_event_loop()
        final_state = await loop.run_in_executor(None, graph.invoke, initial_state)
        
        # Update audit record with results
        audits[audit_id].update({
            "status": "completed",
            "vulnerabilities": final_state.get("vulnerabilities", []),
            "pr_urls": final_state.get("pr_urls", []),
            "event_log": final_state.get("event_log", []),
        })
        
        logger.info(f"Audit {audit_id} completed. Found {len(final_state.get('vulnerabilities', []))} vulns, created {len(final_state.get('pr_urls', []))} PRs")
        
    except Exception as e:
        logger.error(f"Audit {audit_id} failed: {e}", exc_info=True)
        audits[audit_id].update({
            "status": "failed",
            "error": str(e),
            "event_log": audits[audit_id].get("event_log", []) + [f"[Error] Pipeline failed: {str(e)}"],
        })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("code_auditor.api:app", host="0.0.0.0", port=8000, reload=True)
