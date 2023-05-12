from bokeh.plotting import figure, show
from bokeh.models import CustomJS, TapTool, HoverTool

p = figure(title="example figure", x_axis_label="x", y_axis_label="y")
x = [1,2,3]
y = [4,5,1]
p.line(x, y)

helloCode = """
window.speechSynthesis.cancel();
let utterance = new SpeechSynthesisUtterance("hello");
window.speechSynthesis.speak(utterance);
"""
callback = CustomJS(code=helloCode)
p.add_tools(
    TapTool(callback=callback),
)
show(p)

import audio_plot_lib as apl
apl.interactive.plot