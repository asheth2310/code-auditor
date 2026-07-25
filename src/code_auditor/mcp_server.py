"""FastMCP server exposing GitHub operations for the auditor."""
from mcp.server.fastmcp import FastMCP
from typing import Dict

# Mock GitHub service to wrap
class MockGitHubService:
    def clone_repository(self, repo: str, target: str) -> str: return target
    def read_repo_files(self, path: str, ext: str) -> dict: return {}
    def create_branch(self, repo: str, branch: str, base: str) -> str: return branch
    def commit_files(self, repo: str, branch: str, files: dict, msg: str) -> str: return "commit_hash"
    def open_pull_request(self, repo: str, head: str, base: str, title: str, body: str) -> str: return "http://pr-url"

mcp = FastMCP("CodeAuditorGitHubServer")
github = MockGitHubService()

@mcp.tool()
def clone_repository(repo_name: str, target_dir: str) -> str:
    """Clones a GitHub repository to a target directory.
    
    Args:
        repo_name: GitHub repository in owner/repo format.
        target_dir: Target directory path to clone into.
    Returns:
        Path to the cloned repository.
    """
    return github.clone_repository(repo_name, target_dir)

@mcp.tool()
def read_repo_files(clone_path: str, extensions: str = ".py") -> dict:
    """Reads source files from the cloned repository.
    
    Args:
        clone_path: Path to the cloned repository.
        extensions: Comma-separated list of file extensions to read.
    Returns:
        Dictionary mapping file paths to file contents.
    """
    return github.read_repo_files(clone_path, extensions)

@mcp.tool()
def create_branch(repo_name: str, branch_name: str, base_branch: str = "main") -> str:
    """Creates a new branch in the repository.
    
    Args:
        repo_name: GitHub repository in owner/repo format.
        branch_name: Name of the new branch.
        base_branch: Name of the base branch.
    Returns:
        Name of the created branch.
    """
    return github.create_branch(repo_name, branch_name, base_branch)

@mcp.tool()
def commit_files(repo_name: str, branch: str, files: Dict[str, str], message: str) -> str:
    """Commits files to a branch in the repository.
    
    Args:
        repo_name: GitHub repository in owner/repo format.
        branch: Branch to commit to.
        files: Dictionary mapping file paths to file contents.
        message: Commit message.
    Returns:
        Commit hash.
    """
    return github.commit_files(repo_name, branch, files, message)

@mcp.tool()
def open_pull_request(repo_name: str, head: str, base: str, title: str, body: str) -> str:
    """Opens a pull request in the repository.
    
    Args:
        repo_name: GitHub repository in owner/repo format.
        head: Branch containing the changes.
        base: Branch to merge into.
        title: Title of the pull request.
        body: Body/description of the pull request.
    Returns:
        URL of the created pull request.
    """
    return github.open_pull_request(repo_name, head, base, title, body)
