"""CLI entrypoint for the Autonomous Code Auditor."""
import argparse
import logging
import sys
from dotenv import load_dotenv
from .agents.graph import build_graph
from .config import get_settings

def main():
    load_dotenv()
    
    parser = argparse.ArgumentParser(description="Autonomous Multi-Agent Code Auditor & Auto-Patcher")
    parser.add_argument("--repo", required=True, help="GitHub repository (owner/repo)")
    parser.add_argument("--verbose", "-v", action="store_true", help="Enable verbose logging")
    args = parser.parse_args()
    
    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s [%(name)s] %(levelname)s: %(message)s"
    )
    
    settings = get_settings()
    graph = build_graph()
    
    initial_state = {
        "repo_url": f"https://github.com/{args.repo}",
        "repo_name": args.repo,
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
        "error": None
    }
    
    print(f"\n{'='*60}")
    print(f"  Autonomous Code Auditor & Auto-Patcher")
    print(f"  Target: {args.repo}")
    print(f"{'='*60}\n")
    
    try:
        final_state = graph.invoke(initial_state)
        
        print(f"\n{'='*60}")
        print(f"  AUDIT COMPLETE")
        print(f"{'='*60}")
        print(f"  Vulnerabilities found: {len(final_state.get('vulnerabilities', []))}")
        print(f"  Pull Requests opened:  {len(final_state.get('pr_urls', []))}")
        
        if final_state.get('pr_urls'):
            print(f"\n  PRs:")
            for url in final_state['pr_urls']:
                print(f"    → {url}")
        
        print(f"\n  Event Log:")
        for entry in final_state.get('event_log', []):
            print(f"    {entry}")
        print()
        
    except Exception as e:
        logging.error(f"Pipeline failed: {e}", exc_info=True)
        sys.exit(1)

if __name__ == "__main__":
    main()
