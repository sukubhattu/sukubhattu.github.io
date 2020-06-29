function Box(outerBox) {
    this.outerBox = outerBox;
    this.dy = getRandomArbitrary(-2, 2) < 1 ? -0.2 : 0.2;
    this.dx = getRandomArbitrary(-2, 2) < 1 ? -0.2 : 0.2;
    var that = this;

    // for individual box
    this.init = function () {
        this.width = Math.floor(getRandomArbitrary(10, 30));
        this.height = Math.floor(getRandomArbitrary(10, 30));

        var box = document.createElement("div");

        box.style.width = this.width + "px";
        box.style.height = this.height + "px";

        box.classList.add("box");
        box.style.position = "absolute";
        box.style.backgroundColor = randomColor();
        this.outerBox.appendChild(box);

        this.element = box;
        this.draw();
        return this;
    };

    // generates random color for each small box
    function randomColor() {
        red = Math.floor(getRandomArbitrary(0, 255));
        green = Math.floor(getRandomArbitrary(0, 255));
        blue = Math.floor(getRandomArbitrary(0, 255));
        randomColor = "rgb(" + red + ", " + green + ", " + blue + ")";
        // console.log(randomColor);
        return randomColor;
    }

    // sets initial
    this.setPosition = function (x, y) {
        this.x = x;
        this.y = y;
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
        if (top < 0) {
            this.dy < 0 ? (this.dy *= -1) : this.dy;
            this.borderCollided = true;
        }
        if (bottom > height) {
            this.dy > 0 ? (this.dy *= -1) : this.dy;
            this.borderCollided = true;
        }
        if (left < 0) {
            this.dx < 0 ? (this.dx *= -1) : this.dx;
            this.borderCollided = true;
        }
        if (right > width) {
            this.dx > 0 ? (this.dx *= -1) : this.dx;
            this.borderCollided = true;
        }
    };

    //Collision detection among boxes
    this.boxCollision = function (boxes, MAX_WIDTH, MAX_HEIGHT) {
        for (var i = 0; i < boxes.length; i++) {
            //the box value will be true as it is not colliding with itself
            if (this != boxes[i]) {
                if (this.boxCollided == false) {
                    // the main collision logic
                    if (
                        this.x < boxes[i].x + boxes[i].width &&
                        this.x + this.width > boxes[i].x &&
                        this.y < boxes[i].y + boxes[i].height &&
                        this.y + this.height > boxes[i].y
                    ) {
                        if (
                            Math.abs(this.x - boxes[i].x) >
                            Math.abs(this.y - boxes[i].y)
                        ) {
                            this.dx *= -1;
                            that.boxCollided = true;
                        } else {
                            this.dy *= -1;
                            that.boxCollided = true;
                        }
                    }
                }
            }
        }
    };
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function Game(outerBox, outerBoxIndex) {
    var boxes = [];
    this.outerBox = outerBox;
    this.outerBoxIndex = outerBoxIndex;
    var MAX_WIDTH = this.outerBox.clientWidth;
    var MAX_HEIGHT = this.outerBox.clientHeight;

    this.gameLoop = function (boxCount) {
        outerBoxStyle(this.outerBox);
        this.boxCount = boxCount;
        for (var i = 0; i < this.boxCount; i++) {
            var box = new Box(outerBox).init();
            //Check if box overlap
            var value = {};
            var check = true;
            if (boxes.length >= 1) {
                while (check) {
                    var state = false;
                    var overLapped = false;
                    value.x = getRandomArbitrary(0, MAX_WIDTH - box.width);
                    value.y = getRandomArbitrary(0, MAX_HEIGHT - box.height);
                    for (var j = 0; j < boxes.length; j++) {
                        if (
                            value.x < boxes[j].x + boxes[j].width &&
                            value.x + box.width > boxes[j].x &&
                            value.y < boxes[j].y + boxes[j].height &&
                            value.y + box.height > boxes[j].y
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
                boxes.push(box);
            } else {
                box.setPosition(
                    getRandomArbitrary(0, MAX_WIDTH - box.width),
                    getRandomArbitrary(0, MAX_HEIGHT - box.height)
                );
                box.draw();
                boxes.push(box);
            }
        }

        setInterval(this.moveBoxes.bind(this), 0.5);
    };

    this.moveBoxes = function () {
        for (var i = 0; i < this.boxCount; i++) {
            if (!boxes[i].boxCollided) {
                boxes[i].boxCollision(boxes, MAX_WIDTH, MAX_HEIGHT);
            }
            if (!boxes[i].borderCollided) {
                boxes[i].collisionWithBoundary(MAX_WIDTH, MAX_HEIGHT);
            }
            boxes[i].move();
        }
        for (var i = 0; i < this.boxCount; i++) {
            boxes[i].boxCollided = false;
            boxes[i].borderCollided = false;
        }
    };
}

// Set some style to main box
function outerBoxStyle(outerBox) {
    outerBox.style.border = "1px solid black";
    outerBox.style.position = "relative";
    outerBox.style.margin = "auto";
}

var outerBox = document.getElementsByClassName("collision-box");

for (var i = 0; i < outerBox.length; i++) {
    new Game(outerBox[i], i).gameLoop(20);
}
