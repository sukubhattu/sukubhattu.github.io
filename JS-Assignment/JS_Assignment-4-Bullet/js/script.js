// On click of play Button to start game
startCarGame = function () {
    init();
    game.removeChild(gameHeading);
    var gameWorld = new Game();
    gameWorld.init();
};

// Game Screen Before Playing
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
    game.appendChild(gameHeading);

    // on click of play button to start
    playButton.addEventListener("click", startCarGame);
};

/*
For random car car lane can range from 0 to 2.
distanceFromTop defines from where new car will be rendered
playerType defines if car is opponent or player itself
*/
function Cars() {
    this.car = 0;
    this.lane = 0;
    this.distanceFromTop = 80;
    this.playerType = 0;
    this.carHeight = 90;
    this.carWidth = 55;

    // Initializing car with player type i.e real or opponent
    this.init = function (playerType) {
        this.playerType = playerType;
        this.lane =
            this.playerType == "player" ? 1 : Math.floor(Math.random() * 3);
        this.renderCar();
    };

    // Rendering a new car
    this.renderCar = function () {
        this.car = document.createElement("div");
        var car = this.car;
        car.className += "new-car";

        // Defining opponent player and giving it properties
        this.opponentPlayer = document.createElement("img");
        var opponentCar = this.opponentPlayer;
        opponentCar.className += "opponent-car";
        this.opponentPlayer.setAttribute("src", "img/opponent.png");

        // Defining real player and giving it properties
        this.youPlayer = document.createElement("img");
        var playerCar = this.youPlayer;
        playerCar.className += "player-car";
        this.youPlayer.setAttribute("src", "img/you.png");

        /*
        Real player always spawn on middle
        Opponent player lane can vary
        lane defines on which lane it is on
        */
        game.appendChild(this.car);
        if (this.playerType == "opponent") {
            this.car.appendChild(this.opponentPlayer);
            if (this.lane == 0) {
                this.car.style.left = distanceFromLeft[this.lane] + "px";
            }
            if (this.lane == 1) {
                this.car.style.left = distanceFromLeft[this.lane] + "px";
            }
            if (this.lane == 2) {
                this.car.style.left = distanceFromLeft[this.lane] + "px";
            }
        }
        // Defining initial position of real player from top and left
        else if (this.playerType == "player") {
            this.car.style.left = "230px";
            this.distanceFromTop = 450;
            this.car.style.top = this.distanceFromTop + "px";
            this.car.appendChild(this.youPlayer);
        }
    };

    //Moves the enemy cars from up to down
    this.moveOpponent = function () {
        this.distanceFromTop += carSpeedY;
        this.car.style.top = this.distanceFromTop + "px";
    };
}

// Game Structure and Dynamics
function Game() {
    self = this;

    this.init = function () {
        // Checking Key press for movement and bullet
        document.onkeydown = whichKey;

        function whichKey(e) {
            if (e.keyCode == "65") {
                moveLeft();
            } else if (e.keyCode == "68") {
                moveRight();
            } else if (e.keyCode == "87") {
                self.shoot();
            }
        }

        self.gameLoop();
    };
    // To move car left
    moveLeft = function () {
        // A player cannot move more left from leftmost lane

        if (self.playerCar.lane !== 0) {
            self.playerCar.lane--;
            self.playerCar.car.style.left =
                distanceFromLeft[self.playerCar.lane] + "px";
        }
    };

    // to move car right
    moveRight = function () {
        // A player cannot move more right from rightmost lane

        if (self.playerCar.lane !== 2) {
            self.playerCar.lane++;
            self.playerCar.car.style.left =
                distanceFromLeft[self.playerCar.lane] + "px";
        }
    };

    //Create enemy cars
    this.createOpponent = function () {
        newCar = new Cars();
        newCar.init("opponent");
        listOfCars.push(newCar);
    };

    /*
    gameLoop function has setInterval function which runs every 30ms.
    In that 30ms a counter value increase by 1.
    if counter % 25 ==0 new opponent spawns
    if bullet is finished and counter % 200 == 0 bullet reloads
    */
    this.gameLoop = function () {
        this.bgPosition = 0;
        var counter = 0;
        self.loop = setInterval(() => {
            counter++;
            this.bgPosition += speedY;
            game.style.backgroundPosition = "0px " + this.bgPosition + "px";
            if (counter % 25 == 0) self.createOpponent();
            self.checkCollision();
            self.removeOpponent();
            for (var x = 1; x < listOfCars.length; x++) {
                listOfCars[x].moveOpponent();
            }
            if (this.isBulletShot) {
                this.bulletTopPosition = this.bulletTopPosition - bulletSpeed;
                this.bulletElement.style.top = this.bulletTopPosition + "px";
                if (this.bulletTopPosition < 10) {
                    game.removeChild(this.bulletElement);
                    this.isBulletShot = false;
                }
            }
            if (bulletCount == 0) {
                if (counter % 200 == 0) bulletCount = 5;
                scoreElement.innerHTML =
                    "Score: " +
                    parseInt(score) +
                    "<br> High Score: " +
                    highScore +
                    "<br> <br><i> Bullets Reloading...<i>";
            } else {
                scoreElement.innerHTML =
                    "Score: " +
                    parseInt(score) +
                    "<br> High Score: " +
                    highScore +
                    "<br> <br>Remaining Bullets : " +
                    bulletCount;
            }

            if (score > highScore) {
                localStorage.setItem("highScore", score);
                highScore = score;
            }
        }, 30);
    };

    //Creates bullets if upKey is pressed
    this.shoot = function () {
        if (!this.isBulletShot && bulletCount !== 0) {
            this.isBulletShot = true;
            this.bulletLane = this.playerCar.lane;
            this.bulletTopPosition = self.playerCar.distanceFromTop + 5;
            this.bulletElement = document.createElement("div");

            this.bulletElement.setAttribute("id", "bullet");
            this.bulletElementImg = document.createElement("img");
            var bullet = this.bulletElementImg;
            bullet.className += "bullet";
            this.bulletElementImg.setAttribute("src", "img/bullet.png");

            this.bulletElement.appendChild(this.bulletElementImg);
            this.bulletElement.style.position = "absolute";
            this.bulletElement.style.top = this.bulletTopPosition + "px";
            this.bulletElement.style.left =
                parseInt(distanceFromLeft[this.bulletLane]) + "px";
            game.appendChild(this.bulletElement);
            bulletCount--;
        }
    };

    // Remove the car at end of the road
    this.removeOpponent = function () {
        for (var i = 1; i < listOfCars.length; i++) {
            if (listOfCars[i].distanceFromTop >= 510) {
                game.removeChild(listOfCars[i].car);
                listOfCars.splice(i, 1);
                self.updateScore();
            }
        }
    };

    // Update the score and slowly increase the speed
    this.updateScore = function () {
        score += 1;
        speedY += 0.1;
        carSpeedY += 0.1;
    };

    // Collision detection with car && car || car && bullet
    this.checkCollision = function () {
        for (var i = 1; i < listOfCars.length; i++) {
            if (
                listOfCars[i].distanceFromTop >
                    self.playerCar.distanceFromTop - listOfCars[i].carHeight &&
                listOfCars[i].distanceFromTop <
                    self.playerCar.distanceFromTop + self.playerCar.carHeight &&
                listOfCars[i].lane == self.playerCar.lane
            ) {
                gameOver();
                break;
            }

            if (
                listOfCars[i].lane == self.bulletLane &&
                listOfCars[i].distanceFromTop + listOfCars[i].carHeight >=
                    self.bulletTopPosition
            ) {
                game.removeChild(listOfCars[i].car);
                bulletToRemove = document.getElementById("bullet");
                if (bulletToRemove !== null) bulletToRemove.remove();
                this.isBulletShot = false;
                this.bulletTopPosition = self.playerCar.distanceFromTop + 5;
                this.updateScore();
                listOfCars.splice(i, 1);
            }
        }
    };

    gameOver = function () {
        clearInterval(self.loop);
        bulletToRemove = document.getElementById("bullet");
        if (bulletToRemove !== null) bulletToRemove.remove();
        while (listOfCars.length > 0) {
            game.removeChild(listOfCars[0].car);
            listOfCars.shift();
        }

        startGame("Game Over", "Play Again");
    };

    this.playerCar = new Cars();
    this.playerCar.init("player");
    listOfCars.push(self.playerCar);
}

//Initializing Game
init = function () {
    score = 0;
    speedY = 9;
    carSpeedY = 9;
    listOfCars = [];
    distanceFromLeft = ["70", "230", "390"];
    isBulletShot = false;
    bulletSpeed = carSpeedY + 4;
    bulletCount = 5;
    // getting high score from the browser local storage
    highScore = localStorage.getItem("highScore") || 0;
};

game = document.querySelector(".world");
scoreElement = document.querySelector(".score");

startGame(
    "Car Lane Game <br> <br>Press A/D to Move <br> Press W to shoot",
    "PLAY"
);
