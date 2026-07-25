# 🛡️ Autonomous Multi-Agent Code Auditor & Auto-Patcher

An autonomous multi-agent pipeline that scans a GitHub repository for security vulnerabilities, reproduces them with failing tests in Docker sandboxes, generates patches, verifies fixes, and opens Pull Requests — all without human intervention.

```
[GitHub Repo] ──> [Auditor Agent] ──> [Exploit Agent] ──> [Docker Sandbox Test]
                                                                  │
[GitHub Pull Request] <── [Verify Fix] <── [Patch Agent] <────────┘
```

## 🚀 Features

- **Zero False-Positive PRs** — Only opens Pull Requests for security fixes verified by passing tests in clean sandboxes
- **Autonomous Remediation Loop** — Scans → Reproduces → Fixes → Verifies → Submits PRs automatically
- **Safe Execution** — All generated code runs inside network-isolated, resource-constrained Docker containers
- **Self-Healing** — If a patch fails verification, the system feeds errors back to the Patch Agent (up to 3 retries)
- **MCP Integration** — GitHub operations exposed via Model Context Protocol for modular tool access

## 📋 Prerequisites

- **Python 3.11+**
- **Docker Desktop** installed and running
- **GitHub Personal Access Token** with `repo` scope
- **OpenAI API Key** (GPT-4o)

## ⚡ Quick Start

### 1. Clone & Install

```bash
cd code-auditor
pip install -e ".[dev]"
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials:
#   GITHUB_TOKEN=ghp_your_token_here
#   OPENAI_API_KEY=sk-your_key_here
```

### 3. Run the Auditor

```bash
python -m code_auditor.main --repo owner/repo-name --verbose
```

### Example Output

```
============================================================
  Autonomous Code Auditor & Auto-Patcher
  Target: owner/repo-name
============================================================

[Auditor] Found 4 vulnerabilities in 3 files
[SelectVuln] Processing vuln 1/4: sql_injection in app.py
[ExploitSandbox] exit_code=1, status=completed
[VerifySandbox] exit_code=0, status=completed, attempt=1
[PRCreator] Opened PR: https://github.com/owner/repo/pull/42

============================================================
  AUDIT COMPLETE
============================================================
  Vulnerabilities found: 4
  Pull Requests opened:  4
```

## 🏗️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Orchestration | LangGraph (Stateful multi-agent graphs) |
| LLM | OpenAI GPT-4o |
| Protocol | Model Context Protocol (MCP) + FastMCP |
| Sandboxing | Docker SDK for Python (docker-py) |
| Testing | pytest |
| GitHub API | PyGithub |
| Configuration | Pydantic Settings |

## 📁 Project Structure

```
code-auditor/
├── pyproject.toml
├── requirements.txt
├── .env.example
├── CLAUDE.md
├── Dockerfile.sandbox
├── src/code_auditor/
│   ├── __init__.py
│   ├── config.py                 # Pydantic Settings configuration
│   ├── state.py                  # LangGraph state schema
│   ├── sandbox.py                # Docker sandbox execution
│   ├── github_service.py         # GitHub API operations
│   ├── main.py                   # CLI entrypoint
│   ├── mcp_server.py             # FastMCP server for GitHub tools
│   └── agents/
│       ├── auditor.py            # Security vulnerability scanner
│       ├── exploit.py            # Exploit test generator
│       ├── patcher.py            # Code fix generator
│       ├── pr_creator.py         # Pull Request creator
│       └── graph.py              # LangGraph pipeline assembly
├── examples/
│   └── vulnerable_app/
│       └── app.py                # Sample vulnerable app for testing
└── tests/
    └── __init__.py
```

## 🧪 Testing with the Sample Vulnerable App

The `examples/vulnerable_app/app.py` contains intentionally vulnerable code:

| Vulnerability | Function | Type |
|--------------|----------|------|
| SQL Injection | `get_user()` | String concatenation in SQL |
| Command Injection | `run_command()` | Unsanitized `os.system()` |
| Path Traversal | `read_file()` | Unvalidated file paths |
| Unsafe Deserialization | `load_config()` | `yaml.load()` without SafeLoader |

## 🔧 MCP Server

Start the MCP server to expose GitHub tools:

```bash
python -m code_auditor.mcp_server
```

## 📄 License

MIT
