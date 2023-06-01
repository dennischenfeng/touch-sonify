// Modify the figure dimensions. 
// Need to navigate through the shadow tree to get to bokeh figure element.
let bkColumn= document.getElementsByClassName("bk-Column")[0];
let bkFigure;
let shadowNodes = bkColumn.shadowRoot.childNodes;
for (let i = 0; i < shadowNodes.length; i++) {
    if (shadowNodes[i].className === "bk-Figure") {
        bkFigure = shadowNodes[i];
        break;
    };
};

bkFigure.style.width = "min(90vh, 90vw)";
bkFigure.style.height = "min(90vh, 90vw)";
bkFigure.style.minWidth = "min(90vh, 90vw)";
bkFigure.style.minHeight = "min(90vh, 90vw)";
bkFigure.style.maxWidth= "min(90vh, 90vw)";
bkFigure.style.maxHeight= "min(90vh, 90vw)";
