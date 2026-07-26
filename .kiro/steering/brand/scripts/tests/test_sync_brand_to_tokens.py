import subprocess
from pathlib import Path

def test_sync_brand_to_tokens(node: str, tmp_path: Path):
    # Validate the 'node' input to prevent command injection
    if not Path(node).is_file() or not os.access(node, os.X_OK):
        raise ValueError("Invalid 'node' executable path provided.")

    SCRIPT = "sync_brand_to_tokens.js"
    result = subprocess.run(
        [node, str(SCRIPT)],
        cwd=tmp_path,
        capture_output=True,
        text=True,
        check=True  # Ensure an exception is raised on non-zero exit
    )
    return result