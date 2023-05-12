"""Test modeule `plots.py`"""

import pytest
from touch_sonify.plots import plot

def test_plot():
    """Test plot"""
    x = [1.0, 2.0, 3.0]
    y = [4.0, 5.0, 3.0]
    c = [10.0, 20.0, 30.0]
    plot(x, y, c, output_file_name="outputs/test1.html")
