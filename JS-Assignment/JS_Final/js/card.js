class Card {
    constructor(obj) {
        let c = {
            name: obj.name,
            canGrow: true,
            canClick: true,
            img: null,
            images: [],
            timer: null,
            timer_spacing: obj.timer_spacing,
            timer_num: 1,
            sun_val: obj.sun_val,
            row: obj.row,
            x: 0,
            y: obj.y,
        };
        Object.assign(this, c);
    }

    static new(obj) {
        let b = new this(obj);
        b.images.push(imageFromPath(allImg.plantsCard[b.name].img));
        b.images.push(imageFromPath(allImg.plantsCard[b.name].imgG));
        b.canClick ? (b.img = b.images[0]) : (b.img = b.images[1]);
        b.timer_num = b.timer_spacing / 1000;
        return b;
    }

    draw(cxt) {
        let self = this,
            marginLeft = 120;

        self.sun_val > window._main.allSunVal
            ? (self.canGrow = false)
            : (self.canGrow = true);

        self.canGrow && self.canClick
            ? (self.img = self.images[0])
            : (self.img = self.images[1]);

        cxt.drawImage(self.img, self.x + marginLeft, self.y);
        cxt.fillStyle = "black";
        cxt.font = "16px Microsoft YaHei";
        cxt.fillText(self.sun_val, self.x + marginLeft + 60, self.y + 55);

        if (!self.canClick && self.canGrow) {
            cxt.fillStyle = "rgb(255, 255, 0)";
            cxt.font = "20px ";
            cxt.fillText(self.timer_num, self.x + marginLeft + 30, self.y + 35);
        }
    }

    drawCountDown() {
        let self = this;
        self.timer = setInterval(function () {
            if (self.timer_num !== 0) {
                self.timer_num--;
            } else {
                clearInterval(self.timer);
                self.timer_num = self.timer_spacing / 1000;
            }
        }, 1000);
    }

    changeState() {
        let self = this;
        if (!self.canClick) {
            self.timer = setTimeout(() => {
                self.canClick = true;
            }, self.timer_spacing);
        }
    }
}
