class Card {
    constructor(obj) {
        let c = {
            name: obj.name,
            canGrow: true,
            canClick: true,
            img: null,
            images: [],
            timer: null,
            timerSpacing: obj.timerSpacing,
            timerNum: 1,
            sunVal: obj.sunVal,
            row: obj.row,
            x: 0,
            y: obj.y,
        };
        Object.assign(this, c);
    }
    // Create and initialize the current object
    static new(obj) {
        let b = new this(obj);
        // if enough sun then color image
        b.images.push(imageFromPath(allImg.plantsCard[b.name].img));
        // if no enough sun then black and white image
        b.images.push(imageFromPath(allImg.plantsCard[b.name].imgG));
        b.canClick ? (b.img = b.images[0]) : (b.img = b.images[1]);
        b.timerNum = b.timerSpacing / 1000;
        return b;
    }
    // Draw card method
    draw(cxt) {
        let self = this,
            marginLeft = 120;
        // Determine whether plants can be grown based on the total amount of sun
        self.sunVal > window._main.allSunVal
            ? (self.canGrow = false)
            : (self.canGrow = true);
        // Render the corresponding card according to the current state
        self.canGrow && self.canClick
            ? (self.img = self.images[0])
            : (self.img = self.images[1]);
        // Draw card
        cxt.drawImage(self.img, self.x + marginLeft, self.y);
        // display the amount of sun consumed
        cxt.fillStyle = "black";
        cxt.font = "16px Microsoft YaHei";
        cxt.fillText(self.sunVal, self.x + marginLeft + 60, self.y + 55);
        // Draw countdown
        if (!self.canClick && self.canGrow) {
            cxt.fillStyle = "rgb(255, 255, 0)";
            cxt.font = "20px Microsoft YaHei";
            cxt.fillText(self.timerNum, self.x + marginLeft + 30, self.y + 35);
        }
    }
    // Countdown time
    drawCountDown() {
        let self = this;
        self.timer = setInterval(function () {
            if (self.timerNum !== 0) {
                self.timerNum--;
            } else {
                clearInterval(self.timer);
                self.timerNum = self.timerSpacing / 1000;
            }
        }, 1000);
    }
    // Switch the current state  along with image
    changeState() {
        let self = this;
        if (!self.canClick) {
            self.timer = setTimeout(() => {
                self.canClick = true;
            }, self.timerSpacing);
        }
    }
}
