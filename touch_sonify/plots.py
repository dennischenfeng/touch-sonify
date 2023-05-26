"""Plotting functions."""

from bs4 import BeautifulSoup
from touch_sonify.paths import get_project_root_dir
from typing import List, Dict, Optional
from bokeh import events
from bokeh.layouts import column
from bokeh.plotting import figure, show, output_file, save
from bokeh.models import CustomJS, ColumnDataSource, Button
from pathlib import Path


def plot(
    x: List[float],
    y: List[float],
    c: List[float],
    output_file_path: Optional[Path] = None,
) -> Path:
    """
    Generates a color plot using Bokeh which has touch interaction. 
    """
    if not output_file_path:
        output_file_path = Path("temp.html")

    p = figure() 
    data_source = ColumnDataSource(dict(
        x=x,
        y=y,
        c=c,
    ))
    p.scatter(x="x", y="y", color="c", source=data_source)

    custom_js_args = dict(
        xRange=p.x_range,
        yRange=p.y_range,
        dataSource=data_source,
    )
    
    # event listeners
    with open(get_project_root_dir() / "touch_sonify/code_snippets/revertPlotRanges.js", "r") as f:
        code_revert_ranges= f.read()
    with open(get_project_root_dir() / "touch_sonify/code_snippets/assignPlotRanges.js", "r") as f:
        code_assign_ranges = f.read()
    with open(get_project_root_dir() / "touch_sonify/code_snippets/sonifyApertureSingle.js", "r") as f:
        code_tap = f.read()
    with open(get_project_root_dir() / "touch_sonify/code_snippets/sonifyApertureOnTouchMove.js", "r") as f:
        code_pan = f.read()
    with open(get_project_root_dir() / "touch_sonify/code_snippets/sonifyApertureOnTouchEnd.js", "r") as f:
        code_pan_end = f.read()
    
    # lock plot ranges to original values, so "panning" merely  is a touchmove event (for sonifying)
    p.x_range.js_on_change("start", CustomJS(args=custom_js_args, code=code_revert_ranges))
    p.y_range.js_on_change("start", CustomJS(args=custom_js_args, code=code_revert_ranges))
    p.x_range.js_on_change("end", CustomJS(args=custom_js_args, code=code_revert_ranges))
    p.y_range.js_on_change("end", CustomJS(args=custom_js_args, code=code_revert_ranges))

    # add touch events with sonification code
    p.js_on_event(events.Tap, CustomJS(args=custom_js_args, code=code_tap))
    p.js_on_event(events.Pan, CustomJS(args=custom_js_args, code=code_pan))
    p.js_on_event(events.PanStart, CustomJS(args=custom_js_args, code=code_pan))
    p.js_on_event(events.PanEnd, CustomJS(args=custom_js_args, code=code_pan_end))

    # Button to initialize app variables
    initialize_button = Button(label="Initialize") 
    initialize_button.js_on_click(CustomJS(
        args=custom_js_args,
        code=code_assign_ranges,
    ))
    
    output_file(filename=output_file_path, title="title1")
    save(column(initialize_button, p))

    # use soup to add head content
    _insert_preparatory_html(output_file_path)

    return output_file_path

def _insert_preparatory_html(file_path: Path) -> None:
    """
    Insert HTML code, which prepares the html for the functional javascript 
    code. This includes the meta tag to rescale content for all devices, 
    necessary package imports, etc. 
    """
    soup = BeautifulSoup(open(file_path), "html.parser")
    
    code_viewport= """
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    """
    soup.html.insert(0, BeautifulSoup(code_viewport, "html.parser"))

    with open(get_project_root_dir() / "touch_sonify/code_snippets/style.css") as f:
        code_style = f.read();
    full_code_style = f"""
    <style>
    {code_style}
    </style>
    """
    soup.html.insert(0, BeautifulSoup(full_code_style, "html.parser"))

    code_imports = """
    <script src="https://cdn.jsdelivr.net/npm/danfojs@1.1.2/lib/bundle.min.js"></script>
    """
    soup.head.insert(0, BeautifulSoup(code_imports, "html.parser"))

    # Additions to HTML body
    code_audio_button = """
    <button id="audio-button">Initialize audio</button>
    """
    with open(get_project_root_dir() / "touch_sonify/code_snippets/initializeAudio.js", "r") as f:
        code_audio_button_script = f.read()
    with open(get_project_root_dir() / "touch_sonify/code_snippets/sonifyFunctions.js", "r") as f:
        code_sonify_functions = f.read()

    full_code_additions = f"""
    {code_audio_button}
    <script> 
    {code_audio_button_script}
    {code_sonify_functions}
    </script>
    """
    soup.body.insert(0, BeautifulSoup(full_code_additions, "html.parser"))

    with open(file_path, "w") as f:
        f.write(str(soup))
