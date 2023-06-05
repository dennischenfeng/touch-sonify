"""Test modeule `plots.py`"""

import pytest
from touch_sonify.plots import plot
import pandas as pd

def test_plot(project_root_dir):
    """Test plot"""
    df = pd.read_csv(project_root_dir / "tests/inputs/twoClustersDemo.csv")
    x = list(df["x"])
    y = list(df["y"])
    c = list(df["z"])

    output_file_path = project_root_dir / "tests/outputs/test1.html"
    plot(x, y, c, output_file_path=output_file_path)
