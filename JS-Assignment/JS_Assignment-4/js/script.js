/*
For random car car lane can range from 0 to 2.
distanceFromTop defines from where new car will be rendered
carType defines if car is opponent or player itself
*/
function Cars() {
    this.car = 0;
    this.movingLane = 0;
    this.distanceFromTop = 30;
    this.carType = 0;

    this.init = function (carType) {
        this.carType = carType;
        this.movingLane =
            this.carType == "player" ? 1 : Math.floor(Math.random() * 3);
        this.createCars();
    };

    this.createCars = function () {
        this.car = document.createElement("div");
        var car = this.car;
        car.className += "new-car";

        this.carImgOpponent = document.createElement("img");
        var opponentCar = this.carImgOpponent;
        opponentCar.className += "opponent-car";
        this.carImgOpponent.setAttribute("src", "images/opponent.png");

        this.carImgPlayer = document.createElement("img");
        var playerCar = this.carImgPlayer;
        playerCar.className += "player-car";
        this.carImgPlayer.setAttribute("src", "images/you.png");

        worldElement.appendChild(this.car);
        console.log("Moving Lane: " + this.movingLane);
        if (this.carType == "opponent") {
            this.car.appendChild(this.carImgOpponent);
            switch (this.movingLane) {
                case 0:
                    this.car.style.left = distanceFromLeft[this.movingLane];
                    break;

                case 1:
                    this.car.style.left = distanceFromLeft[this.movingLane];
                    break;

                case 2:
                    this.car.style.left = distanceFromLeft[this.movingLane];
                    break;
            }
        } else if (this.carType == "player") {
            this.car.style.left = "230px";
            this.car.style.top = "450px";
            this.car.appendChild(this.carImgPlayer);
        }
    };

    this.moveOpponents = function () {
        this.distanceFromTop += carSpeedY;
        this.car.style.top = this.distanceFromTop + "px";
    };
}

// WORLD INITIALIZATION
function World() {
    self = this;
    this.init = function () {
        document.onkeydown = checkKey;

        function checkKey(e) {
            if (e.keyCode == "65") {
                moveLeft();
            } else if (e.keyCode == "68") {
                moveRight();
            }
        }
        scoreElement.innerHTML =
            "Score: " +
            parseInt(score) +
            "<br>" +
            "Speed: " +
            parseFloat(speedY).toFixed(2);
        self.gameLoop();
    };

    this.gameLoop = function () {
        this.bgPosition = 0;
        var counter = 0;
        self.intervalLoop = setInterval(() => {
            counter++;
            this.bgPosition += speedY;
            worldElement.style.backgroundPosition =
                "0px " + this.bgPosition + "px";
            // create random opponent
            if (counter % 20 == 0) self.createOpponents();
            self.checkCollision();
            self.destroyOpponents();
            for (var i = 1; i < listOfCars.length; i++) {
                listOfCars[i].moveOpponents();
            }
        }, 50);
    };

    moveLeft = function () {
        if (self.playerCar.movingLane !== 0) {
            self.playerCar.movingLane--;
            self.playerCar.car.style.left =
                distanceFromLeft[self.playerCar.movingLane];
        }
    };

    moveRight = function () {
        if (self.playerCar.movingLane !== 2) {
            self.playerCar.movingLane++;
            self.playerCar.car.style.left =
                distanceFromLeft[self.playerCar.movingLane];
        }
    };

    this.createOpponents = function () {
        newCar = new Cars();
        newCar.init("opponent");
        listOfCars.push(newCar);
    };

    // Remove the car at end of the road
    this.destroyOpponents = function () {
        for (var i = 0; i < listOfCars.length; i++) {
            if (listOfCars[i].distanceFromTop >= 460) {
                worldElement.removeChild(listOfCars[i].car);
                listOfCars.splice(i, 1);
                self.updateScore();
                console.log(listOfCars.length);
            }
        }
    };

    this.checkCollision = function () {
        for (var i = 0; i < listOfCars.length; i++) {
            if (
                listOfCars[i].distanceFromTop >= 360 &&
                listOfCars[i].distanceFromTop < 460 &&
                listOfCars[i].movingLane == self.playerCar.movingLane
            ) {
                gameEnds();
            }
        }
    };

    this.updateScore = function () {
        score += 1;
        scoreElement.innerHTML =
            "Score: " +
            parseInt(score) +
            "<br>" +
            " Speed: " +
            parseFloat(speedY).toFixed(2);

        speedY += 0.1;
        carSpeedY += 0.01;
    };

    gameEnds = function () {
        clearInterval(self.intervalLoop);
        score = 0;
        speedY = 10;
        carSpeedY = 10;

        while (listOfCars.length > 0) {
            worldElement.removeChild(listOfCars[0].car);
            listOfCars.shift();
        }

        // sends to initial screen of the game
        startGame("Game Over", "Play Again");
    };

    this.playerCar = new Cars();
    this.playerCar.init("player");
    listOfCars.push(self.playerCar);
}

//Starting of actual Car Game
startCarGame = function () {
    worldElement.removeChild(gameHeading);
    var world = new World();
    world.init();
};

//Entry to the application, and  to Game Over.
startGame = function (gameName, play) {
    gameHeading = document.createElement("div");
    gameHeading.className += "game-name";

    var heading = document.createElement("div");
    heading.innerHTML = gameName;

    var playButton = document.createElement("div");
    playButton.className += "play-game";
    playButton.innerHTML = play;

    gameHeading.appendChild(heading);
    gameHeading.appendChild(playButton);
    worldElement.appendChild(gameHeading);

    // on click of play button to start
    playButton.addEventListener("click", startCarGame);
};

//Starting of application
var worldElement = document.querySelector(".world");
var scoreElement = document.querySelector(".score");
var score = 0;
var speedY = 10;
var carSpeedY = 10;
var listOfCars = [];
// to bring player at middle dashed lane
var distanceFromLeft = ["110px", "230px", "350px"];

startGame("Car Lane Game", "Play");
