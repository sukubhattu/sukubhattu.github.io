class Bullet {
    constructor(plant) {
        let b = {
            img: imageFromPath(allImg.bullet),
            w: 56,
            h: 34,
            x: 0,
            y: 0,
        };
        Object.assign(this, b);
    }

    static new(plant) {
        let b = new this(plant);

        switch (plant.section) {
            case "peashooter":
                b.x = plant.x + 30;
                b.y = plant.y;
                break;
            case "repeater":
                b.x = plant.x + 30;
                b.y = plant.y;
                break;
            case "gatlingpea":
                b.x = plant.x + 30;
                b.y = plant.y + 10;
                break;
        }
        return b;
    }

    draw(game, cxt) {
        let self = this;

        self.step(game);

        cxt.drawImage(self.img, self.x, self.y);
    }

    step(game) {
        game.state === game.state_RUNNING ? (this.x += 4) : (this.x = this.x);
    }
}
