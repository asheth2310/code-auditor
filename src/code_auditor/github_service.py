import os
import subprocess
import logging
from typing import Dict, Any

from github import Github, Auth, InputGitTreeElement

logger = logging.getLogger(__name__)

class GitHubService:
    def __init__(self, token: str):
        self.token = token
        auth = Auth.Token(token)
        self.client = Github(auth=auth)
        
    def clone_repo(self, repo_full_name: str, target_dir: str) -> str:
        """Clones a repository using subprocess and token auth."""
        logger.info(f"Cloning repo {repo_full_name} to {target_dir}")
        repo_url = f"https://oauth2:{self.token}@github.com/{repo_full_name}.git"
        
        try:
            subprocess.run(
                ["git", "clone", repo_url, target_dir],
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            return target_dir
        except subprocess.CalledProcessError as e:
            logger.error(f"Failed to clone repository: {e.stderr}")
            raise RuntimeError(f"Git clone failed: {e.stderr}")
            
    def read_source_files(self, clone_path: str, extensions: tuple = (".py",)) -> Dict[str, str]:
        """Reads all files matching extensions in the cloned repository."""
        source_files = {}
        for root, dirs, files in os.walk(clone_path):
            if '.git' in dirs:
                dirs.remove('.git')
                
            for file in files:
                if file.endswith(extensions):
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, clone_path)
                    try:
                        with open(full_path, "r", encoding="utf-8") as f:
                            source_files[rel_path] = f.read()
                    except Exception as e:
                        logger.warning(f"Could not read {full_path}: {e}")
        return source_files
        
    def create_branch(self, repo_full_name: str, branch_name: str, base_branch: str = "main") -> None:
        """Creates a new branch via PyGithub API."""
        repo = self.client.get_repo(repo_full_name)
        base_ref = repo.get_git_ref(f"heads/{base_branch}")
        try:
            repo.create_git_ref(ref=f"refs/heads/{branch_name}", sha=base_ref.object.sha)
            logger.info(f"Created branch {branch_name}")
        except Exception as e:
            logger.error(f"Failed to create branch {branch_name}: {e}")
            raise

    def commit_files(self, repo_full_name: str, branch: str, files: Dict[str, str], message: str) -> None:
        """Creates an atomic commit with multiple files."""
        repo = self.client.get_repo(repo_full_name)
        
        ref = repo.get_git_ref(f"heads/{branch}")
        base_commit = repo.get_git_commit(ref.object.sha)
        base_tree = base_commit.tree
        
        tree_elements = []
        for file_path, content in files.items():
            blob = repo.create_git_blob(content, "utf-8")
            element = InputGitTreeElement(path=file_path, mode="100644", type="blob", sha=blob.sha)
            tree_elements.append(element)
            
        new_tree = repo.create_git_tree(tree_elements, base_tree)
        new_commit = repo.create_git_commit(message, new_tree, [base_commit])
        ref.edit(sha=new_commit.sha)
        logger.info(f"Committed files to {branch} in {repo_full_name}")
        
    def open_pr(self, repo_full_name: str, head: str, base: str, title: str, body: str) -> Any:
        """Creates a Pull Request."""
        repo = self.client.get_repo(repo_full_name)
        try:
            pr = repo.create_pull(title=title, body=body, head=head, base=base)
            logger.info(f"Created PR: {pr.html_url}")
            return pr
        except Exception as e:
            logger.error(f"Failed to create PR: {e}")
            raise
