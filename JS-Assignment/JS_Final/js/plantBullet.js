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
    // Create and initialize the current object
    static new(plant) {
        let b = new this(plant);
        // Define the coordinates of the bullet
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
    // Drawing method
    draw(game, cxt) {
        let self = this;
        // Moving bullet
        self.step(game);
        // Draw bullets
        cxt.drawImage(self.img, self.x, self.y);
    }
    // Moving method
    step(game) {
        // Bullets can only move when the game is running
        game.state === game.state_RUNNING ? (this.x += 4) : (this.x = this.x);
    }
}
