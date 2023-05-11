from bokeh.plotting import figure, show

p = figure(title="example figure", x_axis_label="x", y_axis_label="y")
x = [1,2,3]
y = [4,5,7]
p.line(x, y)
show(p)
