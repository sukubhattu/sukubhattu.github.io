class Plant extends Role {
    constructor(obj) {
        super(obj);

        let p = {
            life: 3,
            idle: null,
            idleH: null,
            idleM: null,
            idleL: null,
            attack: null,
            digest: null,
            bullets: [],
            state: obj.section === "wallnut" ? 2 : 1,
            state_IDLE: 1,
            state_IDLE_H: 2,
            state_IDLE_M: 3,
            state_IDLE_L: 4,
            state_ATTACK: 5,
            state_DIGEST: 6,
            canShoot: false,
            canSetTimer: obj.canSetTimer,
            sunTimer: null,
            sunTimer_spacing: 10,
        };
        Object.assign(this, p);
    }

    static new(obj) {
        let p = new this(obj);
        p.init();
        return p;
    }

    setSunTimer() {
        let self = this;
        self.sunTimer = setInterval(function () {
            let img = document.createElement("img"),
                container = document.getElementsByTagName("body")[0],
                id = self.id,
                top = self.y + 30,
                left = self.x - 130,
                keyframes1 = [
                    { transform: "translate(0,0)", opacity: 0 },
                    { offset: 0.3, transform: "translate(0,0)", opacity: 1 },
                    { offset: 0.5, transform: "translate(0,0)", opacity: 1 },
                    {
                        offset: 1,
                        transform:
                            "translate(-" +
                            (left - 110) +
                            "px,-" +
                            (top + 50) +
                            "px)",
                        opacity: 0,
                    },
                ];

            img.src = "images/sun.gif";
            img.className += "sun-img plantSun" + id;
            img.style.top = top + "px";
            img.style.left = left + "px";
            container.appendChild(img);

            let sun = document.getElementsByClassName("plantSun" + id)[0];
            sun.animate(keyframes1, keyframesOptions);

            img.addEventListener("click", () => {
                sun.parentNode.removeChild(sun);
                window._main.sunnum.changeSunNum();
            });

            setTimeout(() => {
                if (sun.parentNode) {
                    if (sun.parentNode.hasChildNodes()) {
                        sun.parentNode.removeChild(sun);
                    }
                }
            }, 2700);
        }, self.sunTimer_spacing * 1000);
    }

    clearSunTimer() {
        let self = this;
        clearInterval(self.sunTimer);
    }

    init() {
        let self = this,
            setPlantFn = null;

        setPlantFn = {
            sunflower() {
                self.idle = Animation.new(self, "idle", 12);

                self.canSetTimer && self.setSunTimer();
            },
            peashooter() {
                self.canShoot = true;
                self.idle = Animation.new(self, "idle", 12);
                self.attack = Animation.new(self, "attack", 12);
            },
            repeater() {
                self.canShoot = true;
                self.idle = Animation.new(self, "idle", 12);
                self.attack = Animation.new(self, "attack", 8);
            },
            gatlingpea() {
                self.y -= 12;
                self.canShoot = true;
                self.idle = Animation.new(self, "idle", 8);
                self.attack = Animation.new(self, "attack", 4);
            },
            cherrybomb() {
                self.x -= 15;
                self.idle = Animation.new(self, "idle", 15);
                self.attack = Animation.new(self, "attack", 15);
                setTimeout(() => {
                    self.state = self.state_ATTACK;
                }, 2000);
            },
            wallnut() {
                self.x += 15;

                self.life = 12;

                self.idleH = Animation.new(self, "idleH", 10);
                self.idleM = Animation.new(self, "idleM", 8);
                self.idleL = Animation.new(self, "idleL", 10);
            },
            chomper() {
                self.life = 5;
                self.y -= 45;
                self.idle = Animation.new(self, "idle", 10);
                self.attack = Animation.new(self, "attack", 12);
                self.digest = Animation.new(self, "digest", 12);
            },
        };

        for (let key in setPlantFn) {
            if (self.section === key) {
                setPlantFn[key]();
            }
        }
    }

    draw(cxt) {
        let self = this,
            stateName = self.switchState();
        switch (self.isHurt) {
            case false:
                if (
                    self.section === "cherrybomb" &&
                    self.state === self.state_ATTACK
                ) {
                    cxt.drawImage(
                        self[stateName].img,
                        self.x - 60,
                        self.y - 50
                    );
                } else {
                    cxt.drawImage(self[stateName].img, self.x, self.y);
                }
                break;
            case true:
                cxt.globalAlpha = 0.5;
                cxt.beginPath();
                cxt.drawImage(self[stateName].img, self.x, self.y);
                cxt.closePath();
                cxt.save();
                cxt.globalAlpha = 1;
                break;
        }
    }

    update(game) {
        let self = this,
            section = self.section,
            stateName = self.switchState();

        let animateLen = allImg.plants[section][stateName].len;

        self[stateName].count += 1;

        self[stateName].imgIdx = Math.floor(
            self[stateName].count / self[stateName].fps
        );

        self[stateName].imgIdx === animateLen - 1
            ? (self[stateName].count = 0)
            : (self[stateName].count = self[stateName].count);

        if (game.state === game.state_RUNNING) {
            self[stateName].img =
                self[stateName].images[self[stateName].imgIdx];
            if (self[stateName].imgIdx === animateLen - 1) {
                if (stateName === "attack" && !self.isDel) {
                    if (self.canShoot) {
                        self.shoot();

                        self.section === "repeater" &&
                            setTimeout(() => {
                                self.shoot();
                            }, 250);
                    }

                    self.section === "cherrybomb"
                        ? (self.isDel = true)
                        : (self.isDel = false);

                    if (self.section === "chomper") {
                        setTimeout(() => {
                            self.changeAnimation("digest");
                        }, 0);
                    }
                } else if (
                    self.section === "chomper" &&
                    stateName === "digest"
                ) {
                    setTimeout(() => {
                        self.changeAnimation("idle");
                    }, 30000);
                }
                self.isAnimeLenMax = true;
            } else {
                self.isAnimeLenMax = false;
            }
        }
    }

    canAttack() {
        let self = this;

        if (self.section === "sunflower" || self.section === "wallnut")
            return false;

        for (let zombie of window._main.zombies) {
            if (self.section === "cherrybomb") {
                if (
                    Math.abs(self.row - zombie.row) <= 1 &&
                    Math.abs(self.col - zombie.col) <= 1 &&
                    zombie.col < 10
                ) {
                    self.changeAnimation("attack");
                    zombie.life = 0;

                    zombie.changeAnimation("dieboom");
                }
            } else if (
                self.section === "chomper" &&
                self.state === self.state_IDLE
            ) {
                if (
                    self.row === zombie.row &&
                    zombie.col - self.col <= 1 &&
                    zombie.col < 10
                ) {
                    self.changeAnimation("attack");
                    setTimeout(() => {
                        zombie.isDel = true;
                    }, 1300);
                }
            } else if (self.canShoot && self.row === zombie.row) {
                zombie.x < 940 && self.x < zombie.x + 10 && zombie.life > 0
                    ? self.changeAnimation("attack")
                    : self.changeAnimation("idle");

                if (!self.isDel) {
                    self.bullets.forEach(function (bullet, j) {
                        if (
                            Math.abs(zombie.x + bullet.w - bullet.x) < 10 &&
                            zombie.life > 0
                        ) {
                            self.bullets.splice(j, 1);

                            if (zombie.life !== 0) {
                                zombie.life--;
                                zombie.isHurt = true;
                                setTimeout(() => {
                                    zombie.isHurt = false;
                                }, 200);
                            }
                            if (zombie.life === 2) {
                                zombie.changeAnimation("dying");
                            } else if (zombie.life === 0) {
                                zombie.changeAnimation("die");
                            }
                        }
                    });
                }
            }
        }
    }

    shoot() {
        let self = this;
        self.bullets[self.bullets.length] = Bullet.new(self);
    }
    /**
     * Judge the character status and return the corresponding animation object name method
     */
    switchState() {
        let self = this,
            state = self.state,
            dictionary = {
                idle: self.state_IDLE,
                idleH: self.state_IDLE_H,
                idleM: self.state_IDLE_M,
                idleL: self.state_IDLE_L,
                attack: self.state_ATTACK,
                digest: self.state_DIGEST,
            };
        for (let key in dictionary) {
            if (state === dictionary[key]) {
                return key;
            }
        }
    }
    /**
     * Switch character animation
     * game => game engine object
     * action => action type
     * -idle: standing animation
     * -idleH: Character high blood volume animation (wallnut)
     * -idleM: Character's medium-health animation (wallnut)
     * -idleL: Character low health animation (wallnut)
     * -attack: Attack animation
     * -digest: Digestion animation (pirana)
     */
    changeAnimation(action) {
        let self = this,
            stateName = self.switchState(),
            dictionary = {
                idle: self.state_IDLE,
                idleH: self.state_IDLE_H,
                idleM: self.state_IDLE_M,
                idleL: self.state_IDLE_L,
                attack: self.state_ATTACK,
                digest: self.state_DIGEST,
            };
        if (action === stateName) return;
        self.state = dictionary[action];
    }
}
