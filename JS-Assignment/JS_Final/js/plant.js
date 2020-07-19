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
            stateIdle: 1,
            stateIdleH: 2,
            stateIdleM: 3,
            stateIdleL: 4,
            stateAttack: 5,
            stateDigest: 6,
            canShoot: false,
            canSetTimer: obj.canSetTimer,
            sunTimer: null,
            sunTimerSpacing: 10,
        };
        Object.assign(this, p);
    }
    // Create and initialize the current object
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
                id = self.id, //Current role ID
                top = self.y + 30,
                left = self.x - 130,
                keyframes1 = [
                    //  sun animation keyframes
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
            // Add sun element
            img.src = "images/sun.gif";
            img.className += "sun-img plantSun" + id;
            img.style.top = top + "px";
            img.style.left = left + "px";
            container.appendChild(img);
            // Add sun moving animation
            let sun = document.getElementsByClassName("plantSun" + id)[0];
            sun.animate(keyframes1, keyframesOptions);

            // The animation is complete, clear the sun elements

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
                // Increase the amount of sunlight
            }, 2700);
        }, self.sunTimerSpacing * 1000);
    }
    // Clear sunlight generation timer
    clearSunTimer() {
        let self = this;
        clearInterval(self.sunTimer);
    }
    // initialization
    init() {
        let self = this,
            setPlantFn = null;
        // Initialize plant animation object method
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
                    self.state = self.stateAttack;
                }, 2000);
            },
            wallnut() {
                self.x += 15;

                self.life = 12;
                // Create animated objects with three different HP
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
    // Drawing method
    draw(cxt) {
        let self = this,
            stateName = self.switchState();
        switch (self.isHurt) {
            case false:
                if (
                    self.section === "cherrybomb" &&
                    self.state === self.stateAttack
                ) {
                    // Cherrybomb explosion
                    cxt.drawImage(
                        self[stateName].img,
                        self.x - 60,
                        self.y - 50
                    );
                } else {
                    // Nnormal cherrybomb
                    cxt.drawImage(self[stateName].img, self.x, self.y);
                }
                break;
            case true:
                // Draw translucent pictures when injured or moving plants
                cxt.globalAlpha = 0.5;
                cxt.beginPath();
                cxt.drawImage(self[stateName].img, self.x, self.y);
                cxt.closePath();
                cxt.save();
                cxt.globalAlpha = 1;
                break;
        }
    }
    // update status
    update(game) {
        let self = this,
            section = self.section,
            stateName = self.switchState();
        // Modify the current animation sequence length
        let animateLen = allImg.plants[section][stateName].len;
        // Cumulative animation counter
        self[stateName].count += 1;
        // Set the character animation speed
        self[stateName].imgIdx = Math.floor(
            self[stateName].count / self[stateName].fps
        );
        // Reset the animation counter after a set of animations is completed
        self[stateName].imgIdx === animateLen - 1
            ? (self[stateName].count = 0)
            : (self[stateName].count = self[stateName].count);
        // Draw firing bullet animation
        if (game.state === game.stateRunning) {
            // Set the current frame animation object
            self[stateName].img =
                self[stateName].images[self[stateName].imgIdx];
            if (self[stateName].imgIdx === animateLen - 1) {
                if (stateName === "attack" && !self.isDel) {
                    // When it is not dead and it is a plant capable of firing bullets
                    if (self.canShoot) {
                        // Fire bullets
                        self.shoot();
                        // Dual launchers fire additional bullets
                        self.section === "repeater" &&
                            setTimeout(() => {
                                self.shoot();
                            }, 250);
                    }
                    // When it is a cherry bomb, it will disappear automatically after executing a round of animation
                    self.section === "cherrybomb"
                        ? (self.isDel = true)
                        : (self.isDel = false);
                    // When it's a chomper, execute the attack animation and switch to digest animation
                    if (self.section === "chomper") {
                        // Switching the animation immediately will cause an error if the picture is not loaded
                        setTimeout(() => {
                            self.changeAnimation("digest");
                        }, 0);
                    }
                } else if (
                    self.section === "chomper" &&
                    stateName === "digest"
                ) {
                    // After the digestion animation is completed, switch to the normal state at intervals
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
    // Method for detecting whether plants can attack zombies
    canAttack() {
        let self = this;
        // When the plant type is sunflower and wallnut they cannot attack
        if (self.section === "sunflower" || self.section === "wallnut")
            return false;
        // Looping array of zombie objects
        for (let zombie of window._main.zombies) {
            if (self.section === "cherrybomb") {
                // When it's a cherry bomb
                if (
                    Math.abs(self.row - zombie.row) <= 1 &&
                    Math.abs(self.col - zombie.col) <= 1 &&
                    zombie.col < 10
                ) {
                    // Perform explosion animation
                    self.changeAnimation("attack");
                    zombie.life = 0;
                    // Zombie death animation
                    zombie.changeAnimation("dieboom");
                }
            } else if (
                self.section === "chomper" &&
                self.state === self.stateIdle
            ) {
                // When it is chomper
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
                // When the plant can fire bullets and the zombie and the plant are in the same walk
                // Zombie enters plant range
                zombie.x < 940 && self.x < zombie.x + 10 && zombie.life > 0
                    ? self.changeAnimation("attack")
                    : self.changeAnimation("idle");
                // When the plant is not removed, bullets can be fired
                if (!self.isDel) {
                    self.bullets.forEach(function (bullet, j) {
                        // When the bullet hit the zombie and the zombie did not die
                        if (
                            Math.abs(zombie.x + bullet.w - bullet.x) < 10 &&
                            zombie.life > 0
                        ) {
                            // The distance between the bullet and the zombie is less than 10 and the zombie is not dead
                            // remove bullet
                            self.bullets.splice(j, 1);
                            // Perform different stages of animation based on blood volume
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
    // shooting method
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
                idle: self.stateIdle,
                idleH: self.stateIdleH,
                idleM: self.stateIdleM,
                idleL: self.stateIdleL,
                attack: self.stateAttack,
                digest: self.stateDigest,
            };
        for (let key in dictionary) {
            if (state === dictionary[key]) {
                return key;
            }
        }
    }
    /**
     * Switch character animation
     * action => action type
     * -idle: standing animation
     * -idleH: Character high health  animation (wallnut)
     * -idleM: Character's medium-health animation (wallnut)
     * -idleL: Character low health animation (wallnut)
     * -attack: Attack animation
     * -digest: Digestion animation
     */
    changeAnimation(action) {
        let self = this,
            stateName = self.switchState(),
            dictionary = {
                idle: self.stateIdle,
                idleH: self.stateIdleH,
                idleM: self.stateIdleM,
                idleL: self.stateIdleL,
                attack: self.stateAttack,
                digest: self.stateDigest,
            };
        if (action === stateName) return;
        self.state = dictionary[action];
    }
}
