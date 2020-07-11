class SunNum {
    constructor() {
        let s = {
            img: null,
            sun_num: window._main.allSunVal,
            x: 105,
            y: 0,
        };
        Object.assign(this, s);
    }

    static new() {
        let s = new this();
        s.img = imageFromPath(allImg.sunback);
        return s;
    }

    draw(cxt) {
        let self = this;

        cxt.drawImage(self.img, self.x + 120, self.y);

        cxt.fillStyle = "black";
        cxt.font = "24px";
        cxt.fontWeight = 700;
        cxt.fillText(self.sun_num, self.x + 175, self.y + 27);
    }

    changeSunNum(num = 25) {
        let self = this;
        window._main.allSunVal += num;
        self.sun_num += num;
    }
}
