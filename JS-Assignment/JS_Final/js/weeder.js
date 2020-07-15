class Car {
    constructor(obj) {
        let c = {
            img: imageFromPath(allImg.car),
            state: 1,
            state_NORMALE: 1,
            state_ATTACK: 2,
            w: 71,
            h: 57,
            x: obj.x,
            y: obj.y,
            row: obj.row,
        };
        Object.assign(this, c);
    }

    static new(obj) {
        let c = new this(obj);
        return c;
    }

    draw(game, cxt) {
        let self = this;
        self.canMove();

        self.state === self.state_ATTACK && self.step(game);

        cxt.drawImage(self.img, self.x, self.y);
    }

    step(game) {
        game.state === game.state_RUNNING ? (this.x += 15) : (this.x = this.x);
    }

    canMove() {
        let self = this;
        for (let zombie of window._main.zombies) {
            if (zombie.row === self.row) {
                if (zombie.x < 150) {
                    self.state = self.state_ATTACK;
                }
                if (self.state === self.state_ATTACK) {
                    if (zombie.x - self.x < self.w && zombie.x < 950) {
                        zombie.life = 0;
                        zombie.changeAnimation("die");
                    }
                }
            }
        }
    }
}
