"""Plotting functions."""

from typing import List, Dict, Optional
from bokeh.plotting import figure, show, output_file
from bokeh.models import CustomJS, TapTool, HoverTool

def plot(
        x: List[float],
        y: List[float],
        c: List[float],
        output_file_name: Optional[str] = None,
) -> str:
    """
    Generates a color plot using Bokeh which has touch interaction. 
    """
    
    p = figure()
    p.scatter(x=x, y=y, color=c)
    if output_file_name:
        output_file(output_file_name)
    show(p)

