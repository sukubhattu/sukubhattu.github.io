// Defining class for background which consist of the pipes as obstacles
class Background {
    constructor(ctx, cvs) {
        this.ctx = ctx;
        this.cvs = cvs;
        this.sX = 276;
        this.sY = 0;
        this.w = 224;
        this.h = 112;
        this.x = 0;
        this.y = this.cvs.height - 112;
        this.dx = 2;
    }

    draw() {
        this.ctx.drawImage(
            sprite,
            this.sX,
            this.sY,
            this.w,
            this.h,
            this.x,
            this.y,
            this.w,
            this.h
        );

        this.ctx.drawImage(
            sprite,
            this.sX,
            this.sY,
            this.w,
            this.h,
            this.x + this.w,
            this.y,
            this.w,
            this.h
        );
    }

    update(state) {
        if (state.current == state.game) {
            this.x = (this.x - this.dx) % (this.w / 2);
        }
    }
}
