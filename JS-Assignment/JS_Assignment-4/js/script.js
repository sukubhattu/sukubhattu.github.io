//Initializing Game
var game = document.querySelector(".game");
var scoreDiv = document.querySelector(".score");
var score = 0;
var speedY = 10;
var carSpeedY = 10;
var listOfCars = [];
// to bring player at middle
var distanceFromLeft = ["70px", "230px", "390px"];

// On click of play Button to start game
startCarGame = function () {
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
    this.distanceFromTop = 30;
    this.playerType = 0;

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
                this.car.style.left = distanceFromLeft[this.lane];
            }
            if (this.lane == 1) {
                this.car.style.left = distanceFromLeft[this.lane];
            }
            if (this.lane == 2) {
                this.car.style.left = distanceFromLeft[this.lane];
            }
        }
        // Defining initial position of real player from top and left
        else if (this.playerType == "player") {
            this.car.style.left = "230px";
            this.car.style.top = "420px";
            this.car.appendChild(this.youPlayer);
        }
    };

    this.moveOpponent = function () {
        this.distanceFromTop += carSpeedY;
        this.car.style.top = this.distanceFromTop + "px";
    };
}

// Game Structure and Dynamics
function Game() {
    self = this;

    this.init = function () {
        // Checking Key press for movement
        document.onkeydown = whichKey;

        function whichKey(e) {
            if (e.keyCode == "65") {
                moveLeft();
            } else if (e.keyCode == "68") {
                moveRight();
            }
        }
        scoreDiv.innerHTML = "Score: " + parseInt(score) + "<br>";
        self.gameLoop();
    };

    // To move car left
    moveLeft = function () {
        // A player cannot move more left from leftmost lane

        if (self.playerCar.lane !== 0) {
            self.playerCar.lane--;
            self.playerCar.car.style.left =
                distanceFromLeft[self.playerCar.lane];
        }
    };

    // to move car right
    moveRight = function () {
        // A player cannot move more right from rightmost lane

        if (self.playerCar.lane !== 2) {
            self.playerCar.lane++;
            self.playerCar.car.style.left =
                distanceFromLeft[self.playerCar.lane];
        }
    };

    // to spawn random enemies
    this.createOpponent = function () {
        newCar = new Cars();
        newCar.init("opponent");
        listOfCars.push(newCar);
    };

    /*
    gameLoop function has setInterval function which runs every 30ms.
    In that 50 ms a counter value increase by 1.
    if counter % 20 ==0 new opponent spawns
    */
    this.gameLoop = function () {
        this.bgPosition = 0;
        var counter = 0;
        self.loop = setInterval(() => {
            counter++;
            this.bgPosition += speedY;
            game.style.backgroundPosition = "0px " + this.bgPosition + "px";
            // create random opponent
            if (counter % 20 == 0) self.createOpponent();
            self.checkCollision();
            self.removeOpponent();
            for (var i = 1; i < listOfCars.length; i++) {
                listOfCars[i].moveOpponent();
            }
        }, 50);
    };

    // Remove the car at end of the road
    this.removeOpponent = function () {
        for (var i = 0; i < listOfCars.length; i++) {
            if (listOfCars[i].distanceFromTop >= 430) {
                game.removeChild(listOfCars[i].car);
                listOfCars.splice(i, 1);
                self.updateScore();
            }
        }
    };

    // Update the score and slowly increase the speed
    this.updateScore = function () {
        score += 1;
        scoreDiv.innerHTML = "Score: " + parseInt(score) + "<br>";

        speedY += 0.1;
        carSpeedY += 0.01;
    };

    // Collision detection with car && car
    this.checkCollision = function () {
        for (var i = 0; i < listOfCars.length; i++) {
            if (
                listOfCars[i].distanceFromTop >= 330 &&
                listOfCars[i].distanceFromTop < 460 &&
                listOfCars[i].lane == self.playerCar.lane
            ) {
                gameOver();
            }
        }
    };

    gameOver = function () {
        clearInterval(self.loop);
        score = 0;
        speedY = 10;
        carSpeedY = 10;

        while (listOfCars.length > 0) {
            game.removeChild(listOfCars[0].car);
            listOfCars.shift();
        }

        // sends to initial screen of the game
        startGame("Game Over", "Play Again");
    };

    this.playerCar = new Cars();
    this.playerCar.init("player");
    listOfCars.push(self.playerCar);
}

startGame("Car Lane Game <br> Press A/D to move", "Play");
