class Main {
    constructor() {
        let m = {
            loading: null,
            cards: [],
            cards_info: {
                x: 0,
                y: 0,
                position: [
                    {
                        name: "sunflower",
                        row: 1,
                        sun_val: 50,
                        // 5
                        timer_spacing: 1 * 1000,
                    },

                    {
                        name: "peashooter",
                        row: 3,
                        sun_val: 100,
                        // 7
                        timer_spacing: 1 * 1000,
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
        };
        Object.assign(this, m);
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

        self.setCards(self.cards_info);

        self.setRoles(self.plants_info);

        self.game = Game.new();
    }
}

window._main = new Main();
window._main.start();
// multiple window._main for multiple levels
