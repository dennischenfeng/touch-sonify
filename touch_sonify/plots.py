"""Plotting functions."""

from typing import List, Dict, Optional
from bokeh import events
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
        output_file(filename=output_file_name, title="title1")
    
    # tap event listener
    tapCode = """
    let x = cb_obj.x;
    let y = cb_obj.y;
    window.speechSynthesis.cancel();
    let msg = new SpeechSynthesisUtterance(`x is ${x}, and y is ${y}`)
    window.speechSynthesis.speak(msg);
    """
    p.js_on_event(events.Tap, CustomJS(code=tapCode))

    show(p)

