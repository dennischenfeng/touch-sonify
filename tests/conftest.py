"""Configuration file for pytests"""

import pytest
from touch_sonify.paths import get_project_root_dir
from pathlib import Path

@pytest.fixture(scope="session")
def project_root_dir() -> Path:
    return get_project_root_dir()