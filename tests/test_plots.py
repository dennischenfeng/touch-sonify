"""Test modeule `plots.py`"""

import pytest
from touch_sonify.plots import plot

def test_plot(project_root_dir):
    """Test plot"""
    x = [1.0, 5.0, 5.5, 9.0, 9.0, 9.0, 4.5]
    y = [1.0, 5.0, 5.5, 8.0, 5.0, 2.0, 5.5]
    c = [10.0, 20.0, 22.0, 30, 25.0, 20.0, 40.0]
    output_file_path = project_root_dir / "tests/outputs/test1.html"
    plot(x, y, c, output_file_path=output_file_path)
