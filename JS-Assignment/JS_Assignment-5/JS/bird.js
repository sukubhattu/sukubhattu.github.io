// Defining class for bird
class Bird {
    constructor(ctx, cvs) {
        // On animation use following array of image from sprite
        this.animation = [
            { sX: 276, sY: 112 },
            { sX: 276, sY: 139 },
            { sX: 276, sY: 164 },
            { sX: 276, sY: 139 },
        ];

        this.x = 50;
        this.y = 150;
        this.w = 34;
        this.h = 26;

        this.radius = 12;
        this.frame = 0;
        this.gravity = 0.25;
        this.jump = 4.6;
        this.speed = 0;
        this.rotation = 0;
        this.ctx = ctx;
        this.cvs = cvs;
        this.fg = new Background(this.ctx, this.cvs);
    }

    // Rendering bird
    draw() {
        let bird = this.animation[this.frame];

        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.rotation);
        this.ctx.drawImage(
            sprite,
            bird.sX,
            bird.sY,
            this.w,
            this.h,
            -this.w / 2,
            -this.h / 2,
            this.w,
            this.h
        );

        this.ctx.restore();
    }

    // Bird jumping logic
    flap() {
        this.speed = -this.jump;
    }

    // Update the bird
    // The facing direction of the bird is determined by value of degree
    update(state) {
        this.frame++;
        this.period = state.current == state.getReady ? 10 : 5;
        this.frame += this.frame % this.period == 0 ? 1 : 0;
        this.frame = this.frame % this.animation.length;

        if (state.current == state.getReady) {
            this.y = 150;
            this.rotation = 0 * DEGREE;
        } else {
            // Moving bird horizontally and letting it fall vertically on gravity value
            this.speed += this.gravity;
            this.y += this.speed;

            if (this.y + this.h / 2 >= this.cvs.height - this.fg.h) {
                this.y = this.cvs.height - this.fg.h - this.h / 2;
                if (state.current == state.game) {
                    state.current = state.over;
                }
            }

            if (this.speed >= this.jump) {
                // On jumping bird should face upward
                this.rotation = 90 * DEGREE;
                this.frame = 1;
            } else {
                // The bird starts to fall and slowly make player feel that the bird is facing downward
                this.rotation = -35 * DEGREE;
            }
        }
    }

    speedReset() {
        this.speed = 0;
    }
}
