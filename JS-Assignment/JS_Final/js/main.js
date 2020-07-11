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

            plants_info: {
                type: "plant",
                x: 250,
                y: 92,
                position: [],
            },

            zombies_idx: 0,
            zombies_row: 0,
            zombies_iMax: 1,
            sunTimer: null,
            sunTimer_difference: 5,
            zombieTimer: null,
            zombieTimer_difference: 1,
            game: null,
            fps: 60,
        };
        Object.assign(this, m);
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
            }
        }
    }

    start() {
        let self = this;
        self.loading = Animation.new({ type: "loading" }, "write", 55);
        self.sunnum = SunNum.new();
        self.setCards(self.cards_info);
        self.setRoles(self.plants_info);
        self.game = Game.new();
    }
}

window._main = new Main();
window._main.start();

const sunOutsides = document
    .getElementsByClassName("systemSun")[0]
    .addEventListener("click", () => {
        window._main.sunnum.changeSunNum();
    });
