// Defining set of controls for the flappy bird
class Flappy {
    constructor(parentId) {
        this.cvs = document.getElementById(parentId);
        this.ctx = this.cvs.getContext("2d");

        this.state = {
            current: 0,
            getReady: 0,
            game: 1,
            over: 2,
        };
        // Position of start botton
        this.startBtn = {
            x: 120,
            y: 263,
            w: 83,
            h: 29,
        };

        this.bird = new Bird(this.ctx, this.cvs);
        this.pipe = new Pipes(
            this.ctx,
            this.cvs,
            this.bird,
            this.state,
            this.score
        );

        this.fg = new Background(this.ctx, this.cvs);
    }

    gameController(keyCode) {
        this.cvs.addEventListener("click", (e) => {
            switch (this.state.current) {
                case this.state.getReady:
                    this.state.current = this.state.game;
                    break;
                // running game
                case this.state.game:
                    if (this.bird.y - this.bird.radius <= 0) return;
                    this.bird.flap();
                    flap1.play();
                    break;

                //game over
                case this.state.over:
                    let rect = this.cvs.getBoundingClientRect();
                    let clickX = e.clientX - rect.left;
                    let clickY = e.clientY - rect.top;

                    // Checks if the player has clicked on start game
                    if (
                        clickX >= this.startBtn.x &&
                        clickX <= this.startBtn.x + this.startBtn.w &&
                        clickY >= this.startBtn.y &&
                        clickY <= this.startBtn.y + this.startBtn.h
                    ) {
                        this.pipe.reset();
                        this.bird.speedReset();
                        this.state.current = this.state.getReady;
                    }
                    break;
            }
        });
    }

    // Renders get ready sprite on the screen
    getReady() {
        const spriteValues = {
            sX: 0,
            sY: 228,
            w: 173,
            h: 152,
            x: this.cvs.width / 2 - 173 / 2,
            y: 80,
        };

        // Only renders get ready sprite if the game is not started
        if (this.state.current === this.state.getReady) {
            this.ctx.drawImage(
                sprite,
                spriteValues.sX,
                spriteValues.sY,
                spriteValues.w,
                spriteValues.h,
                spriteValues.x,
                spriteValues.y,
                spriteValues.w,
                spriteValues.h
            );
        }
    }

    // Renders game over sprite on the screen
    gameOver() {
        const spriteValues = {
            sX: 175,
            sY: 228,
            w: 225,
            h: 202,
            x: this.cvs.width / 2 - 225 / 2,
            y: 90,
        };

        // Only renders if the current game is over
        if (this.state.current === this.state.over) {
            this.ctx.drawImage(
                sprite,
                spriteValues.sX,
                spriteValues.sY,
                spriteValues.w,
                spriteValues.h,
                spriteValues.x,
                spriteValues.y,
                spriteValues.w,
                spriteValues.h
            );
        }
    }

    // Updates score every time when the bird successfully crossed each set of two pipe
    drawScore() {
        this.ctx.fillStyle = "#FFF";
        this.ctx.strokeStyle = "#000";

        if (this.state.current == this.state.game) {
            this.ctx.lineWidth = 2;
            this.ctx.font = "35px Teko";
            this.ctx.fillText(this.pipe.score.value, this.cvs.width / 2, 50);
            this.ctx.strokeText(this.pipe.score.value, this.cvs.width / 2, 50);
        } else if (this.state.current == this.state.over) {
            this.pipe.resetScore();

            // Score achieved on current game
            this.ctx.font = "25px Teko";
            this.ctx.fillText(this.pipe.score.value, 225, 186);
            this.ctx.strokeText(this.pipe.score.value, 225, 186);
            // Best score of all time
            this.ctx.fillText(this.pipe.score.best, 225, 228);
            this.ctx.strokeText(this.pipe.score.best, 225, 228);
        }
    }

    draw() {
        this.ctx.fillStyle = "#70c5ce";
        this.ctx.fillRect(0, 0, this.cvs.width, this.cvs.height);

        // renders bird pipes
        this.bird.draw();
        this.pipe.draw();
        this.fg.draw();

        this.getReady();
        this.gameOver();
        this.drawScore();
    }

    // Updating the bird, pipe and background state in the game
    update() {
        this.bird.update(this.state);
        this.fg.update(this.state);
        this.pipe.update();
    }
}
