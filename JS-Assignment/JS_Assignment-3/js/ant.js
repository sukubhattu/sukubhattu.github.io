var outerBox = document.getElementsByClassName("ant");
for (var i = 0; i < outerBox.length; i++) {
    new Ant(outerBox[i], i).gameLoop(15);
}

// this random generates random value between (max-min) and adds min value to it
function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

// For individual
function Box(outerBox) {
    this.x = 20;
    this.y = 20;
    this.width = 80;
    this.height = 80;
    this.element = 0;
    this.dy = getRandom(-2, 2) < 1 ? -0.5 : 0.5;
    this.dx = getRandom(-2, 2) < 1 ? -0.5 : 0.5;
    this.outerBox = outerBox;
    var that = this;

    // for individual ant
    this.init = function () {
        var box = document.createElement("div");
        this.width = Math.floor(getRandom(45, 65));
        this.height = Math.floor(getRandom(35, 40));
        box.classList.add("box");
        box.style.width = this.width + "px";
        box.style.height = this.height + "px";

        box.style.position = "absolute";
        box.style.backgroundImage = 'url("./img/ant.gif")';
        // setting ant background and its sizing
        box.style.backgroundSize = this.width + "px " + this.height + "px";
        this.outerBox.appendChild(box);
        this.element = box;
        this.element.onclick = this.boxClicked.bind(this);

        this.draw();
        return this;
    };

    // sets initial
    this.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
    };

    // removing ant on click
    this.boxClicked = function (index) {
        that.outerBox.removeChild(that.element);
    };

    this.draw = function () {
        this.element.style.top = this.y + "px";
        this.element.style.left = this.x + "px";
    };

    // moving with value dx and dy
    this.move = function () {
        this.x += this.dx;
        this.y += this.dy;
        this.draw();
    };

    //Collision detection of the box and the main container
    this.collisionWithBoundary = function (width, height) {
        var top = this.y;
        var left = this.x;
        var right = this.x + this.width;
        var bottom = this.y + this.height;
        if (top < 0 || bottom > height) {
            this.dy *= -1;
        }
        if (left < 0 || right > width) {
            this.dx *= -1;
        }
    };

    //Collision detection among ants
    this.boxCollision = function (ants) {
        for (var i = 0; i < ants.length; i++) {
            //the box value will be true as it is not colliding with itself
            if (this != ants[i]) {
                // the main collision logic
                if (
                    this.x < ants[i].x + ants[i].width &&
                    this.x + this.width > ants[i].x &&
                    this.y < ants[i].y + ants[i].height &&
                    this.y + this.height > ants[i].y
                ) {
                    if (
                        Math.abs(this.x - ants[i].x) >
                        Math.abs(this.y - ants[i].y)
                    ) {
                        this.dx *= -1;
                    } else {
                        this.dy *= -1;
                    }
                }
            }
        }
    };
}
// Set some style to main box
function outerBoxStyle(outerBox) {
    outerBox.style.border = "1px solid black";
    outerBox.style.position = "relative";
    outerBox.style.margin = "auto";
}

function Ant(outerBox, outerBoxIndex) {
    var ants = [];
    this.outerBox = outerBox;
    this.outerBoxIndex = outerBoxIndex;
    var MAX_WIDTH = this.outerBox.clientWidth;
    var MAX_HEIGHT = this.outerBox.clientHeight;

    this.gameLoop = function (boxCount) {
        outerBoxStyle(this.outerBox);
        this.boxCount = boxCount;
        for (var i = 0; i < this.boxCount; i++) {
            var box = new Box(outerBox).init(i, this.outerBoxIndex);
            //Check if box position overlaps
            var value = {};
            var check = true;
            if (ants.length >= 1) {
                while (check) {
                    var state = false;
                    var overLapped = false;
                    value.x = getRandom(0, MAX_WIDTH - box.width);
                    value.y = getRandom(0, MAX_HEIGHT - box.height);
                    for (var j = 0; j < ants.length; j++) {
                        if (
                            value.x < ants[j].x + ants[j].width &&
                            value.x + box.width > ants[j].x &&
                            value.y < ants[j].y + ants[j].height &&
                            value.y + box.height > ants[j].y
                        ) {
                            overLapped = true;
                            break;
                        } else {
                            state = true;
                        }
                    }
                    if (overLapped == false && state == true) {
                        check = false;
                    }
                }
                box.setPosition(value.x, value.y);
                box.draw();
                ants.push(box);
            } else {
                box.setPosition(
                    getRandom(0, MAX_WIDTH - box.width),
                    getRandom(0, MAX_HEIGHT - box.height)
                );
                box.draw();
                ants.push(box);
            }
        }
        setInterval(this.moveAnts.bind(this), 10);
    };

    this.moveAnts = function () {
        for (var i = 0; i < this.boxCount; i++) {
            ants[i].boxCollision(ants, MAX_WIDTH, MAX_HEIGHT);
            ants[i].move();
            ants[i].collisionWithBoundary(MAX_WIDTH, MAX_HEIGHT);
        }
    };
}
