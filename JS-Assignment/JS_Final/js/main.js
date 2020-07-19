let hasSunSpawn = false;
class Main {
    constructor() {
        let m = {
            // initailly sun value is 200
            allSunVal: 200,
            loading: null,
            sunnum: null,
            cars: [],
            carsInfo: {
                x: 170,
                y: 102,
                position: [
                    { row: 1 },
                    { row: 2 },
                    { row: 3 },
                    { row: 4 },
                    { row: 5 },
                ],
            },
            cards: [],
            cards_info: {
                x: 0,
                y: 0,
                position: [
                    {
                        name: "sunflower",
                        row: 1,
                        sunVal: 50,
                        timerSpacing: 5 * 1000,
                    },
                    {
                        name: "wallnut",
                        row: 2,
                        sunVal: 50,
                        timerSpacing: 8 * 1000,
                    },
                    {
                        name: "peashooter",
                        row: 3,
                        sunVal: 100,
                        timerSpacing: 7 * 1000,
                    },
                    {
                        name: "repeater",
                        row: 4,
                        sunVal: 150,
                        timerSpacing: 8 * 1000,
                    },
                    {
                        name: "gatlingpea",
                        row: 5,
                        sunVal: 200,
                        timerSpacing: 10 * 1000,
                    },
                    {
                        name: "chomper",
                        row: 6,
                        sunVal: 200,
                        timerSpacing: 9 * 1000,
                    },
                    {
                        name: "cherrybomb",
                        row: 7,
                        sunVal: 250,
                        timerSpacing: 12 * 1000,
                    },
                ],
            },
            plants: [],
            zombies: [],
            plants_info: {
                type: "plant",
                x: 250,
                y: 92,
                position: [],
            },
            zombies_info: {
                type: "zombie",
                x: 170,
                y: 15,
                position: [],
            },
            zombies_idx: 0,
            zombies_row: 0,
            zombies_iMax: 25,
            sunTimer: null,
            sunTimer_difference: 8,
            zombieTimer: null,
            zombieTimer_difference: 10,
            game: null,
            fps: 60,
        };
        Object.assign(this, m);
    }
    // Set randomly generated zombie information
    setZombiesInfo() {
        let self = this;

        if (window.level == 2) {
            self.zombies_iMax = 35;
        } else if (window.level == 3) {
            self.zombies_iMax = 40;
        }

        let iMax = self.zombies_iMax;

        for (let i = 0; i < iMax; i++) {
            let row = Math.ceil(Math.random() * 5);
            self.zombies_info.position.push({
                section: "zombie",
                row: row,
                col: 13 + Number(Math.random().toFixed(1)),
            });
        }
    }
    // Clear global timer
    clearTiemr() {
        let self = this;
        // Clear global sun generation timer
        clearInterval(self.sunTimer);
        // Clear global zombie generation timer
        clearInterval(self.zombieTimer);

        for (let plant of self.plants) {
            if (plant.section === "sunflower") {
                plant.clearSunTimer();
            }
        }
    }

    sunOutsides = document.getElementsByClassName("systemSun");

    // Set global sun, zombie generation timer
    setTimer() {
        let self = this,
            zombies = self.zombies;
        // Set global sun timer
        self.sunTimer = setInterval(function () {
            hasSunSpawn = true;
            // Generate global sun animation
            let left = parseInt(
                    window.getComputedStyle(
                        document.getElementsByClassName("systemSun")[0],
                        null
                    ).left
                ),
                top = "-100px",
                keyframes1 = [
                    { transform: "translate(0,0)", opacity: 0 },
                    {
                        offset: 0.5,
                        transform: "translate(0,300px)",
                        opacity: 1,
                    },
                    {
                        offset: 0.75,
                        transform: "translate(0,300px)",
                        opacity: 1,
                    },
                    {
                        offset: 1,
                        transform: "translate(-" + (left - 110) + "px,50px)",
                        opacity: 0,
                    },
                ];

            document
                .getElementsByClassName("systemSun")[0]
                .animate(keyframes1, keyframesOptions);

            setTimeout(function () {
                // Reset the system sun positioning
                document.getElementsByClassName("systemSun")[0].style.left =
                    Math.floor(Math.random() * 200 + 300) + "px";
                document.getElementsByClassName("systemSun")[0].style.top =
                    "-100px";
            }, 2700);
        }, 1000 * self.sunTimer_difference);

        // Set Zombie Generation Timer
        self.zombieTimer = setInterval(function () {
            let idx = self.zombies_iMax - self.zombies_idx - 1;
            if (self.zombies_idx === self.zombies_iMax) {
                // The number of zombie generation reaches the maximum, clear the timer
                return clearInterval(self.zombieTimer);
            }
            // Zombies start to move
            if (self.zombies[idx]) {
                self.zombies[idx].state = self.zombies[idx].state_RUN;
            }
            self.zombies_idx++;
        }, 1000 * self.zombieTimer_difference);
    }
    // Create an array of weeder object initialization
    setCars(carsInfo) {
        let self = this;
        for (let car of carsInfo.position) {
            let info = {
                x: carsInfo.x,
                y: carsInfo.y + 100 * (car.row - 1),
                row: car.row,
            };
            self.cars.push(Car.new(info));
        }
    }
    // Create card object initialization array
    setCards(cards_info) {
        let self = this;
        for (let card of cards_info.position) {
            /**
             * Card initialization information
             * name: card name
             * row: card row coordinates
             * sunVal: the amount of sunlight consumed
             * timerSpacing: card cooling time
             * y: y coordinate
             */
            let info = {
                name: card.name,
                row: card.row,
                sunVal: card.sunVal,
                timerSpacing: card.timerSpacing,
                y: cards_info.y + 60 * (card.row - 1),
            };
            self.cards.push(Card.new(info));
        }
    }
    // Create initial message containing role
    setRoles(roles_info) {
        let self = this,
            type = roles_info.type;
        // Create corresponding character coordinate array according to coordinates
        for (let role of roles_info.position) {
            /**
             * Character initialization information
             * type: character type
             * x: x axis coordinate
             * y: y coordinate
             * col: column coordinates
             * row: row coordinate
             */
            let info = {
                type: roles_info.type,
                section: role.section,
                x: roles_info.x + 80 * (role.col - 1),
                y: roles_info.y + 100 * (role.row - 1),
                col: role.col,
                row: role.row,
            };
            // Create the corresponding character from the character coordinate array
            if (type === "plant") {
                self.plants.push(Plant.new(info));
            } else if (type === "zombie") {
                // here we are creating new zombies, what we do is

                if (Math.random() > 0.6) {
                    self.zombies.push(Zombie.new(info, "type2")); //create type 2 zombies
                } else self.zombies.push(Zombie.new(info));
            }
        }
    }
    // Game launcher
    start() {
        let self = this;
        // Create loading object, draw loading screen
        self.loading = Animation.new({ type: "loading" }, "write", 55);
        // Create Sun Instance Object
        self.sunnum = SunNum.new();
        // Generate zombie array information
        self.setZombiesInfo();
        // Create an array of cars instance objects to clear a whole line of zombies
        self.setCars(self.carsInfo);
        // Create an array of card instance objects, and plant cards can be placed in the upper left corner
        self.setCards(self.cards_info);
        // Create an array of plant instance objects and draw plants
        self.setRoles(self.plants_info);
        // Create an array of zombie instance objects and draw zombies
        self.setRoles(self.zombies_info);
        // Create a game engine class
        self.game = Game.new();
    }
}

window.takeMeHome = () => {
    // turn off any sound here , we are in menu screen
    plantWon.pause();
    zombieWon.pause();
    menuBackground.pause();
    plantWon.currentTime = 0;
    zombieWon.currentTime = 0;
    menuBackground.currentTime = 0;
    document.getElementById("js-startGame-btn").style.display = "block";
    document.getElementById("restartGame").style.display = "none";
    document.getElementById("goHome").style.display = "none";
    document.getElementsByClassName("cards-list")[0].style.display = "none";
    document.getElementsByClassName("systemSun")[0].style.display = "none";

    if (window.level == 1)
        document.getElementById("js-startGame-btn").innerHTML =
            "Click to start the game";
    else
        document.getElementById("js-startGame-btn").innerHTML =
            "Start level " + window.level;

    // simple level implementation
    window._main = null;
    window._main = new Main();
    window._main.start();

    console.log("This is the window level ", window.level);
};

window.level = 1;
window._main = new Main();
window._main.start();

const sunOutsides = document
    .getElementsByClassName("systemSun")[0]
    .addEventListener("click", () => {
        if (hasSunSpawn) {
            window._main.sunnum.changeSunNum();
            hasSunSpawn = false;
        }
    });
