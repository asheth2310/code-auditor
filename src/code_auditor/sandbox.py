import os
import tempfile
import shutil
import logging
from typing import Dict, Any

import docker
from docker.errors import DockerException, ImageNotFound

logger = logging.getLogger(__name__)

class DockerSandbox:
    def __init__(self, image_name: str = "python:3.11-slim", timeout: int = 30):
        self.image_name = image_name
        self.timeout = timeout
        try:
            self.client = docker.from_env()
        except DockerException as e:
            logger.error(f"Failed to initialize Docker client: {e}")
            raise

    def build_sandbox_image(self) -> None:
        """Build sandbox image from Dockerfile.sandbox if it doesn't exist."""
        try:
            self.client.images.get(self.image_name)
            logger.info(f"Image {self.image_name} already exists.")
        except ImageNotFound:
            logger.info(f"Building image {self.image_name}...")
            if os.path.exists("Dockerfile.sandbox"):
                try:
                    self.client.images.build(path=".", dockerfile="Dockerfile.sandbox", tag=self.image_name)
                    logger.info(f"Successfully built image {self.image_name}")
                except Exception as e:
                    logger.error(f"Failed to build image: {e}")
                    raise
            else:
                try:
                    self.client.images.pull(self.image_name)
                    logger.info(f"Successfully pulled image {self.image_name}")
                except Exception as e:
                    logger.error(f"Failed to pull image: {e}")
                    raise

    def run_pytest(self, test_code: str, source_files: Dict[str, str], timeout: int = None) -> Dict[str, Any]:
        timeout_val = timeout if timeout is not None else self.timeout
        temp_dir = tempfile.mkdtemp()
        container = None
        result = {
            "exit_code": -1,
            "stdout": "",
            "stderr": "",
            "status": "error"
        }
        
        try:
            # Write source files
            for file_path, content in source_files.items():
                full_path = os.path.join(temp_dir, file_path)
                os.makedirs(os.path.dirname(full_path), exist_ok=True)
                with open(full_path, "w", encoding="utf-8") as f:
                    f.write(content)
            
            # Write test code
            test_file_path = os.path.join(temp_dir, "test_exploit.py")
            with open(test_file_path, "w", encoding="utf-8") as f:
                f.write(test_code)
                
            logger.info(f"Running pytest in container with image {self.image_name}")
            
            container = self.client.containers.run(
                image=self.image_name,
                command="python -m pytest test_exploit.py -v",
                volumes={temp_dir: {'bind': '/workspace', 'mode': 'rw'}},
                working_dir="/workspace",
                network_mode="none",
                mem_limit="512m",
                detach=True
            )
            
            try:
                wait_result = container.wait(timeout=timeout_val)
                result["exit_code"] = wait_result.get("StatusCode", -1)
                result["status"] = "completed"
            except Exception as e:
                logger.warning(f"Container execution timed out or failed: {e}")
                result["status"] = "timeout"
                
            stdout_logs = container.logs(stdout=True, stderr=False)
            stderr_logs = container.logs(stdout=False, stderr=True)
            result["stdout"] = stdout_logs.decode("utf-8", errors="replace")
            result["stderr"] = stderr_logs.decode("utf-8", errors="replace")
            
        except Exception as e:
            logger.error(f"Error running sandbox: {e}")
            result["stderr"] = str(e)
        finally:
            if container:
                try:
                    container.stop(timeout=1)
                except Exception:
                    pass
                try:
                    container.remove(force=True)
                except Exception as e:
                    logger.error(f"Failed to remove container: {e}")
                    
            try:
                shutil.rmtree(temp_dir)
            except Exception as e:
                logger.error(f"Failed to cleanup temp dir {temp_dir}: {e}")
                
        return result
