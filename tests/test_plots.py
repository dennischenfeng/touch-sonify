"""Test modeule `plots.py`"""

import pytest
from touch_sonify.plots import plot, plot_from_csv
import pandas as pd

def test_plot(project_root_dir):
    """Test plot"""
    # two clusters
    csv_file_path = project_root_dir / "tests/inputs/twoClustersDemo.csv"
    output_file_path = project_root_dir / "tests/outputs/twoClustersDemo.html"
    plot_from_csv(csv_file_path, output_file_path)

    # spiral
    csv_file_path = project_root_dir / "tests/inputs/spiralDemo.csv"
    output_file_path= project_root_dir / "tests/outputs/spiralDemo.html"
    plot_from_csv(csv_file_path, output_file_path)

    # diamond
    csv_file_path = project_root_dir / "tests/inputs/diamondHeatmapDemo.csv"
    output_file_path= project_root_dir / "tests/outputs/diamondHeatmapDemo.html"
    plot_from_csv(csv_file_path, output_file_path)
    
