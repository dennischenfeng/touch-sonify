"""Functions to get file and directory paths."""

from pathlib import Path

def get_project_root_dir() -> Path:
    return Path(__file__).parent.parent
