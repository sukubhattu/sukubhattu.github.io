/*
 * Weeding car
 */
class Car {
    constructor(obj) {
        let c = {
            img: imageFromPath(allImg.car),
            state: 1,
            stateNormal: 1,
            stateAttack: 2,
            w: 71,
            h: 57,
            x: obj.x,
            y: obj.y,
            row: obj.row,
        };
        Object.assign(this, c);
    }
    // Create and initialize the current object
    static new(obj) {
        let c = new this(obj);
        return c;
    }
    // Drawing method
    draw(game, cxt) {
        let self = this;
        self.canMove();

        self.state === self.stateAttack && self.step(game);

        cxt.drawImage(self.img, self.x, self.y);
    }
    // Moving method
    step(game) {
        // The mower can only move when the game is running
        game.state === game.stateRunning ? (this.x += 15) : (this.x = this.x);
    }
    // Determine whether to move the car (when zombie.x <150)
    canMove() {
        let self = this;
        for (let zombie of window._main.zombies) {
            if (zombie.row === self.row) {
                if (zombie.x < 150) {
                    // When the zombie approaches the house, start the weeder car
                    self.state = self.stateAttack;
                }
                if (self.state === self.stateAttack) {
                    // When the weeding vehicle starts, clear the entire line of zombies
                    if (zombie.x - self.x < self.w && zombie.x < 950) {
                        zombie.life = 0;
                        zombie.changeAnimation("die");
                    }
                }
            }
        }
    }
}
