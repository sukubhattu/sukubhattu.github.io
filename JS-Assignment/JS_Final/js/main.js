/**
 * Game running main function
 */

let hasSunSpawn = false;
class Main {
    constructor() {
        let m = {
            // In aach level the game starts with 200 sun points
            allSunVal: 200,
            loading: null,
            sunnum: null,
            cars: [],
            cars_info: {
                // Initialization parameters
                // x Axis coordinates
                x: 170,
                // y Axis coordinates
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
                // Initialization parameters

                x: 0,
                y: 0,
                position: [
                    {
                        name: "sunflower",
                        row: 1,
                        // 50
                        sun_val: 10,
                        timer_spacing: 5 * 1000,
                    },
                    {
                        name: "wallnut",
                        row: 2,
                        // 50
                        sun_val: 10,
                        timer_spacing: 10 * 1000,
                    },
                    {
                        name: "peashooter",
                        row: 3,
                        // 100
                        sun_val: 10,
                        timer_spacing: 7 * 1000,
                    },
                    {
                        name: "repeater",
                        row: 4,
                        // 150
                        sun_val: 10,
                        timer_spacing: 8 * 1000,
                    },
                    {
                        name: "gatlingpea",
                        row: 5,
                        // 200
                        sun_val: 10,
                        timer_spacing: 10 * 1000,
                    },
                    {
                        name: "chomper",
                        row: 6,
                        // 200
                        sun_val: 10,
                        timer_spacing: 7 * 1000,
                    },
                    {
                        name: "cherrybomb",
                        row: 7,
                        // 250
                        sun_val: 10,
                        timer_spacing: 12 * 1000,
                    },
                ],
            },
            // Instantiate an array of plant objects
            plants: [],
            // Instantiate an array of zombie objects
            zombies: [],
            plants_info: {
                type: "plant",
                x: 250,
                y: 92,
                position: [],
            },
            zombies_info: {
                type: "zombie", // Role type
                x: 170,
                y: 15,
                position: [],
            },
            zombies_idx: 0,
            zombies_row: 0,
            zombies_iMax: 1,
            sunTimer: null,
            // Time difference of sunlight time (unit: second)
            sunTimer_difference: 10,
            // Global timer for controlling global timing to generate zombies
            zombieTimer: null,
            // Time difference between zombies (unit: seconds)
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
            self.zombies_iMax = 20;
        } else if (window.level == 3) {
            self.zombies_iMax = 30;
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
        // Clear global sunlight generation timer
        clearInterval(self.sunTimer);
        // Clear global zombie generation timer
        clearInterval(self.zombieTimer);
        // Sunshine generation timer to clear sunflower
        for (let plant of self.plants) {
            if (plant.section === "sunflower") {
                plant.clearSunTimer();
            }
        }
    }

    sunOutsides = document.getElementsByClassName("systemSun");

    // Set  sun, zombie generation timer
    setTimer() {
        let self = this,
            zombies = self.zombies;
        // Set  sun timer
        self.sunTimer = setInterval(function () {
            hasSunSpawn = true;
            let left = parseInt(
                    window.getComputedStyle(
                        document.getElementsByClassName("systemSun")[0],
                        null
                    ).left
                ), // Get the left value of the current element
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
    // Create an array of weeder car object initialization
    setCars(cars_info) {
        let self = this;
        for (let car of cars_info.position) {
            let info = {
                x: cars_info.x,
                y: cars_info.y + 100 * (car.row - 1),
                row: car.row,
            };
            self.cars.push(Car.new(info));
        }
    }

    setCards(cards_info) {
        let self = this;
        for (let card of cards_info.position) {
            let info = {
                name: card.name,
                row: card.row,
                sun_val: card.sun_val,
                timer_spacing: card.timer_spacing,
                y: cards_info.y + 60 * (card.row - 1),
            };
            self.cards.push(Card.new(info));
        }
    }
    // Create initial message containing role
    setRoles(roles_info) {
        let self = this,
            type = roles_info.type;

        for (let role of roles_info.position) {
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
                // Randomly generating two types of zombie
                if (Math.random() > 0.6) {
                    //create type 2 zombies
                    self.zombies.push(Zombie.new(info, "type2"));
                } else self.zombies.push(Zombie.new(info));
            }
        }
    }

    start() {
        let self = this;
        self.loading = Animation.new({ type: "loading" }, "write", 55);
        self.sunnum = SunNum.new();
        self.setZombiesInfo();
        self.setCars(self.cars_info);
        self.setCards(self.cards_info);
        self.setRoles(self.plants_info);
        self.setRoles(self.zombies_info);
        self.game = Game.new();
    }
}

window.takeMeHome = () => {
    // turn off any sound here , we are in menu screen
    plantWon.pause();
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

    // Simple level implementation logic
    window._main = null;
    window._main = new Main();
    window._main.start();

    console.log("This is the window level ", window.level);
};

window.level = 1;
window._main = new Main();
window._main.start();

// This prevents double sun click
const sunOutsides = document
    .getElementsByClassName("systemSun")[0]
    .addEventListener("click", () => {
        if (hasSunSpawn) {
            window._main.sunnum.changeSunNum();
            hasSunSpawn = false;
        }
    });
