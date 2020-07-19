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
            timer_num: 1, //plant cool down time
            sun_val: obj.sun_val,
            row: obj.row,
            x: 0,
            y: obj.y,
        };
        Object.assign(this, c);
    }
    // Create and initialize the current object
    static new(obj) {
        let b = new this(obj);
        // For active cards (i.e colorful plantable cards)
        b.images.push(imageFromPath(allImg.plantsCard[b.name].img));

        // For inactive cards (i.e black and white non-plantable cards)
        b.images.push(imageFromPath(allImg.plantsCard[b.name].imgG));
        b.canClick ? (b.img = b.images[0]) : (b.img = b.images[1]);

        // Every plant has its cool down time
        b.timer_num = b.timer_spacing / 1000;
        return b;
    }
    // Draw card method
    draw(cxt) {
        let self = this,
            marginLeft = 120;
        // Determine if there is enough sun to grow that plant
        self.sun_val > window._main.allSunVal
            ? (self.canGrow = false)
            : (self.canGrow = true);
        // If enough sun then color image else black and white image
        self.canGrow && self.canClick
            ? (self.img = self.images[0])
            : (self.img = self.images[1]);
        // Draw card on canvas
        cxt.drawImage(self.img, self.x + marginLeft, self.y);

        // Display the value of sun consumed by each plant
        cxt.fillStyle = "black";
        cxt.font = "16px Microsoft YaHei";
        cxt.fillText(self.sun_val, self.x + marginLeft + 60, self.y + 55);

        // Each plant has different count down before planting it once more
        if (!self.canClick && self.canGrow) {
            cxt.fillStyle = "rgb(255, 255, 0)";
            cxt.font = "20px Microsoft YaHei";
            cxt.fillText(self.timer_num, self.x + marginLeft + 30, self.y + 35);
        }
    }

    // Count down for each plant is decremented by 1 each second
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

    // Switch to plantable and non plantable state
    changeState() {
        let self = this;
        if (!self.canClick) {
            self.timer = setTimeout(() => {
                self.canClick = true;
            }, self.timer_spacing);
        }
    }
}
