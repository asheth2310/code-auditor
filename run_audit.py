"""Quick test script to run a real audit end-to-end."""
from dotenv import load_dotenv
load_dotenv()

from code_auditor.agents.graph import build_graph
from code_auditor.config import get_settings

settings = get_settings()
graph = build_graph()

state = {
    "repo_url": "https://github.com/asheth2310/patchforge",
    "repo_name": "asheth2310/patchforge",
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
    "max_retries": 1,  # Only 1 retry to speed up
    "pr_urls": [],
    "event_log": [],
    "status": "running",
    "error": None,
}

print("Starting audit...")
print()

try:
    result = graph.invoke(state)
    print()
    print("=" * 50)
    print("AUDIT COMPLETE")
    print("=" * 50)
    print(f"Vulnerabilities: {len(result.get('vulnerabilities', []))}")
    print(f"PRs created: {len(result.get('pr_urls', []))}")
    print(f"PR URLs: {result.get('pr_urls', [])}")
    print()
    print("Event log:")
    for e in result.get("event_log", []):
        print(f"  {e}")
except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()
