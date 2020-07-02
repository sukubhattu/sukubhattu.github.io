class Pipes {
    constructor(ctx, cvs, bird, state) {
        this.ctx = ctx;
        this.cvs = cvs;
        this.bird = bird;
        this.state = state;

        this.position = [];

        this.top = {
            sX: 553,
            sY: 0,
        };
        this.bottom = {
            sX: 502,
            sY: 0,
        };

        this.w = 53;
        this.h = 400;
        this.gap = 100;
        this.maxYPos = -150;
        this.dx = 2;
        this.frames = 0;

        this.score = {
            best: parseInt(window.localStorage.getItem("best")) || 0,
            value: 0,
        };
    }

    draw() {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;

            // top pipe
            this.ctx.drawImage(
                sprite,
                this.top.sX,
                this.top.sY,
                this.w,
                this.h,
                p.x,
                topYPos,
                this.w,
                this.h
            );

            // bottom pipe
            this.ctx.drawImage(
                sprite,
                this.bottom.sX,
                this.bottom.sY,
                this.w,
                this.h,
                p.x,
                bottomYPos,
                this.w,
                this.h
            );
        }
    }

    update() {
        this.frames++;

        if (this.state.current !== this.state.game) return;

        if (this.frames % 100 === 0) {
            this.position.push({
                x: this.cvs.width,
                y: this.maxYPos * (Math.random() + 1),
            });
        }

        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            let bottomPipeYpos = p.y + this.h + this.gap;

            //   Collision detection with top pipe
            if (
                this.bird.x + this.bird.radius > p.x &&
                this.bird.x - this.bird.radius < p.x + this.w &&
                this.bird.y + this.bird.radius > p.y &&
                this.bird.y - this.bird.radius < p.y + this.h
            ) {
                this.state.current = this.state.over;
                collision.play();
            }
            //   Collision detection with bottom pipe
            if (
                this.bird.x + this.bird.radius > p.x &&
                this.bird.x - this.bird.radius < p.x + this.w &&
                this.bird.y + this.bird.radius > bottomPipeYpos &&
                this.bird.y - this.bird.radius < bottomPipeYpos + this.h
            ) {
                this.state.current = this.state.over;
                collision.play();
            }

            p.x -= this.dx;

            if (p.x + this.w <= 0) {
                this.position.shift();
                this.score.value += 1;
                score.play();
                this.score.best = Math.max(this.score.value, this.score.best);
                window.localStorage.setItem("best", this.score.best);
            }
        }
    }

    //  On new game reset pipe array
    reset() {
        this.position = new Array();
    }

    resetScore() {
        this.score.value = 0;
    }
}
