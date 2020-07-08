class Card {
    constructor(obj) {
        let c = {
            name: obj.name,
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

        cxt.drawImage(self.img, self.x + marginLeft, self.y);
    }
}

class Animation {
    constructor(role, action, fps) {
        let a = {
            type: role.type,
            section: role.section,
            action: action,
            images: [],
            img: null,
            imgIdx: 0,
            count: 0,
            imgHead: null,
            imgBody: null,
            imgIdxHead: 0,
            imgIdxBody: 0,
            countHead: 0,
            fps: fps,
        };
        Object.assign(this, a);
    }

    static new(role, action, fps) {
        let a = new this(role, action, fps);
        a.create();
        a.images[0].onload = function () {
            role.w = this.width;
            role.h = this.height;
        };
        return a;
    }

    create() {
        let self = this,
            section = self.section;
        switch (self.type) {
            case "plant":
                for (
                    let i = 0;
                    i < allImg.plants[section][self.action].len;
                    i++
                ) {
                    let idx = i < 10 ? "0" + i : i,
                        path = allImg.plants[section][self.action].path;
                    self.images.push(imageFromPath(path.replace(/\*/, idx)));
                }
                break;

            case "loading":
                for (let i = 0; i < allImg.loading[self.action].len; i++) {
                    let idx = i < 10 ? "0" + i : i,
                        path = allImg.loading[self.action].path;

                    self.images.push(imageFromPath(path.replace(/\*/, idx)));
                }
                break;
        }
    }
}
