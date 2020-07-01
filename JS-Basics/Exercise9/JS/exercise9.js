// define height and width of the container

var container_height = 500;
var container_width = 500;

var ball_size = 40;
var direction = 1;

// function to create container
function createContainer(height, width) {
    // create a div
    var container = document.createElement("div");
    container.setAttribute("id", "container");
    container.style.height = height + "px";
    container.style.width = width + "px";
    container.style.margin = "auto";
    container.style.border = 1 + "px solid black";
    container.style.position = "relative";

    // add container to body
    document.body.appendChild(container);

    return container;
}

// function to draw ball
function drawBall(size) {
    var ball = document.createElement("div");
    ball.style.height = size + "px";
    ball.style.width = size + "px";
    ball.style.position = "relative";
    ball.style.backgroundColor = "blue";
    ball.style.borderRadius = "50%";

    // add ball to container
    container.appendChild(ball);

    return ball;
}

// function to plot
function plot(x, y) {
    ball = drawBall(ball_size);
    ball.style.top = x + "px";
    ball.style.left = y + "px";
}
// call function to create container
var container = createContainer(container_height, container_width);

// to plot the ball
var ball1 = plot(0, 230);

setInterval(function () {
    if (container_height - ball_size === parseInt(ball.style.top)) {
        direction = -1;
    } else if (parseInt(ball.style.top) === 0) {
        direction = 1;
    }
    ball.style.top = parseFloat(ball.style.top) + direction + "px";
}, 10);
