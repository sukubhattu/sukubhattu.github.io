class SunNum {
    constructor() {
        let s = {
            img: null,
            // Total number of sun
            sun_num: window._main.allSunVal,
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
        // Draw sun background frame
        cxt.drawImage(self.img, self.x + 120, self.y);
        // Plotting the amount of sun
        cxt.fillStyle = "black";
        cxt.font = "24px Microsoft YaHei";
        cxt.fontWeight = 700;
        cxt.fillText(self.sun_num, self.x + 175, self.y + 27);
    }
    // Change the amount of sunlight
    changeSunNum(num = 25) {
        let self = this;
        window._main.allSunVal += num;
        self.sun_num += num;
    }
}
