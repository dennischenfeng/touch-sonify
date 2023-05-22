"""Plotting functions."""

from bs4 import BeautifulSoup
from touch_sonify.paths import get_project_root_dir
from typing import List, Dict, Optional
from bokeh import events
from bokeh.plotting import figure, show, output_file, save
from bokeh.models import CustomJS, ColumnDataSource
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
    output_file(filename=output_file_path, title="title1")
    
    # tap event listener
    with open(get_project_root_dir() / "touch_sonify/code_snippets/sonify_aperture.js") as f:
        code_tap = f.read()
    custom_js_args = dict(
        xRange=p.x_range,
        yRange=p.y_range,
        dataSource=data_source,
    )
    p.js_on_event(events.Tap, CustomJS(args=custom_js_args, code=code_tap))

    save(p)

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

    code_imports = """
    <script src="https://cdn.jsdelivr.net/npm/danfojs@1.1.2/lib/bundle.min.js"></script>
    """
    soup.head.insert(0, BeautifulSoup(code_imports, "html.parser"))

    # initialize-audio button
    code_audio_button = """
    <button id="audio-button">Initialize audio</button>
    """
    with open(get_project_root_dir() / "touch_sonify/code_snippets/initialize_audio.js", "r") as f:
        code_audio_button_script = f.read()

    full_code_audio = f"""
    {code_audio_button}
    <script> 
    {code_audio_button_script}
    </script>
    """
    soup.body.insert(0, BeautifulSoup(full_code_audio, "html.parser"))

    with open(file_path, "w") as f:
        f.write(str(soup))
