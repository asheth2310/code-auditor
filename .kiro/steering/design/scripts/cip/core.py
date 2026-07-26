def _search_csv(filepath):
    import os
    from pathlib import Path

    # Ensure filepath is a Path object
    if not isinstance(filepath, Path):
        filepath = Path(filepath)

    # Mitigate path traversal by resolving the absolute path and checking against a safe base directory
    base_dir = Path("/safe/base/directory").resolve()
    try:
        resolved_path = filepath.resolve(strict=False)
        if not resolved_path.is_relative_to(base_dir):
            raise ValueError("Access to the specified path is not allowed.")
    except Exception as e:
        return []

    if not resolved_path.exists():
        return []

    data = _load_csv(resolved_path)
    return data