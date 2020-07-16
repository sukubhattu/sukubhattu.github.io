let hasSunSpawn = false;
class Main {
    constructor() {
        let m = {
            allSunVal: 200,
            loading: null,
            sunnum: null,
            cars: [],
            cars_info: {
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
                        sun_val: 50,

                        timer_spacing: 1 * 1000,
                    },
                    {
                        name: "wallnut",
                        row: 2,
                        sun_val: 50,

                        timer_spacing: 1 * 1000,
                    },
                    {
                        name: "peashooter",
                        row: 3,
                        sun_val: 100,

                        timer_spacing: 1 * 1000,
                    },
                    {
                        name: "repeater",
                        row: 4,
                        sun_val: 150,

                        timer_spacing: 1 * 1000,
                    },
                    {
                        name: "gatlingpea",
                        row: 5,
                        sun_val: 200,

                        timer_spacing: 1 * 1000,
                    },
                    {
                        name: "chomper",
                        row: 6,
                        sun_val: 200,
                        timer_spacing: 15 * 1000,
                    },
                    {
                        name: "cherrybomb",
                        row: 7,
                        sun_val: 250,
                        timer_spacing: 25 * 1000,
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
            zombies_iMax: 10,
            sunTimer: null,
            sunTimer_difference: 5,
            zombieTimer: null,
            zombieTimer_difference: 9,
            game: null,
            fps: 60,
        };
        Object.assign(this, m);
    }

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
                col: 11 + Number(Math.random().toFixed(1)),
            });
        }
    }

    clearTiemr() {
        let self = this;

        clearInterval(self.sunTimer);

        clearInterval(self.zombieTimer);

        for (let plant of self.plants) {
            if (plant.section === "sunflower") {
                plant.clearSunTimer();
            }
        }
    }

    sunOutsides = document.getElementsByClassName("systemSun");

    setTimer() {
        let self = this,
            zombies = self.zombies;

        self.sunTimer = setInterval(function () {
            hasSunSpawn = true;

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
                document.getElementsByClassName("systemSun")[0].style.left =
                    Math.floor(Math.random() * 200 + 300) + "px";
                document.getElementsByClassName("systemSun")[0].style.top =
                    "-100px";
            }, 2700);
        }, 1000 * self.sunTimer_difference);

        self.zombieTimer = setInterval(function () {
            let idx = self.zombies_iMax - self.zombies_idx - 1;
            if (self.zombies_idx === self.zombies_iMax) {
                return clearInterval(self.zombieTimer);
            }

            if (self.zombies[idx]) {
                self.zombies[idx].state = self.zombies[idx].state_RUN;
            }
            self.zombies_idx++;
        }, 1000 * self.zombieTimer_difference);
    }

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

            if (type === "plant") {
                self.plants.push(Plant.new(info));
            } else if (type === "zombie") {
                if (Math.random() > 0.6) {
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
