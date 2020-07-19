class SunNum {
    constructor() {
        let s = {
            img: null,
            sunNumbers: window._main.allSunVal,
            x: 105,
            y: 0,
        };
        Object.assign(this, s);
    }
    // Create and initialize the current object
    static new() {
        let s = new this();
        s.img = imageFromPath(allImg.sunback);
        return s;
    }

    // Drawing method
    draw(cxt) {
        let self = this;
        cxt.drawImage(self.img, self.x + 120, self.y);
        cxt.fillStyle = "black";
        cxt.font = "24px Microsoft YaHei";
        cxt.fontWeight = 700;
        cxt.fillText(self.sunNumbers, self.x + 175, self.y + 27);
    }

    // Update the amount of sunlight with +25
    changeSunNum(num = 25) {
        let self = this;
        window._main.allSunVal += num;
        self.sunNumbers += num;
    }
}
