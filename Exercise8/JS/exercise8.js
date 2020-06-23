var points = [
    { x: 10, y: 20 },
    { x: 400, y: 400 },
    { x: 600, y: 200 },
];
var height = 700;
var width = 700;
var point_size = 10;

// create container function
function drawContainer(height, width) {
    var container = document.createElement("div");
    container.style.height = height + "px";
    container.style.width = width + "px";
    container.style.backgroundColor = "#66ff66";
    container.style.position = "relative";
    container.setAttribute("id", "container");
    container.style.margin = "auto";

    document.body.appendChild(container);

    return container;
}

// create small dot function
function drawDot() {
    var dot = document.createElement("div");
    dot.style.height = point_size + "px";
    dot.style.width = point_size + "px";
    dot.style.position = "absolute";
    dot.setAttribute("id", "dot");
    dot.style.backgroundColor = "red";
    dot.style.borderRadius = 8 + "px";

    container.appendChild(dot);

    return dot;
}

// function to plot
function plot(x, y) {
    var dot = drawDot();
    dot.style.left = x + "px";
    dot.style.top = y + "px";
}

// Create container
var container = drawContainer(height, width);

// lets plot each element
for (var i = 0; i < points.length; i++) {
    plot(points[i].x, points[i].y);
}
