class Zombie extends Role {
    constructor(obj, type = "type1") {
        super(obj);

        let z = {
            life: type === "type1" ? 10 : 15,
            canMove: true,
            attackPlantID: 0,
            idle: null,
            run: null,
            attack: null,
            dieboom: null,
            dying: null,
            die: null,
            state: 1,
            state_IDLE: 1,
            state_RUN: 2,
            state_ATTACK: 3,
            state_DIEBOOM: 4,
            state_DYING: 5,
            state_DIE: 6,
            state_DIGEST: 7,
            speed: 3,
            head_x: 0,
            head_y: 0,
            zombieType: type,
        };
        Object.assign(this, z);
    }

    static new(obj, type = "type1") {
        let p = new this(obj);
        p.zombieType = type;

        if (p.zombieType == "type2") {
            p.life = 15;
        } else if (p.zombieType == "type1") {
            p.life = 10;
        }

        p.init();
        return p;
    }

    init() {
        let self = this;

        self.idle = Animation.new(self, "idle", 12);

        self.run = Animation.new(self, "run", 12);

        self.attack = Animation.new(self, "attack", 8);

        self.dieboom = Animation.new(self, "dieboom", 8);

        self.dying = Animation.new(self, "dying", 8);

        self.die = Animation.new(self, "die", 12);
    }

    draw(cxt) {
        let self = this,
            stateName = self.switchState();
        if (stateName !== "dying" && stateName !== "die") {
            if (!self.isHurt) {
                cxt.drawImage(self[stateName].img, self.x, self.y);
            } else {
                cxt.globalAlpha = 0.5;
                cxt.beginPath();
                cxt.drawImage(self[stateName].img, self.x, self.y);
                cxt.closePath();
                cxt.save();
                cxt.globalAlpha = 1;
            }
        } else {
            if (!self.isHurt) {
                cxt.drawImage(
                    self[stateName].imgHead,
                    self.head_x + 70,
                    self.head_y - 10
                );
                cxt.drawImage(self[stateName].imgBody, self.x, self.y);
            } else {
                cxt.globalAlpha = 0.5;
                cxt.beginPath();
                cxt.drawImage(self[stateName].imgBody, self.x, self.y);
                cxt.closePath();
                cxt.save();
                cxt.globalAlpha = 1;

                cxt.drawImage(
                    self[stateName].imgHead,
                    self.head_x + 70,
                    self.head_y - 10
                );
            }
        }
    }

    update(game) {
        let self = this,
            stateName = self.switchState();

        self.canMove ? (self.speed = 3) : (self.speed = 0);

        self.col = Math.floor((self.x - window._main.zombies_info.x) / 80 + 1);
        if (stateName !== "dying" && stateName !== "die") {
            let animateLen = allImg.zombies[this.zombieType][stateName].len;

            self[stateName].count += 1;

            self[stateName].imgIdx = Math.floor(
                self[stateName].count / self[stateName].fps
            );

            if (self[stateName].imgIdx === animateLen) {
                self[stateName].count = 0;
                self[stateName].imgIdx = 0;
                if (stateName === "dieboom") {
                    self.isDel = true;
                }

                self.isAnimeLenMax = true;
            } else {
                self.isAnimeLenMax = false;
            }

            if (game.state === game.state_RUNNING) {
                self[stateName].img =
                    self[stateName].images[self[stateName].imgIdx];
                if (stateName === "run") {
                    self.x -= self.speed / 17;
                }
            }
        } else if (stateName === "dying") {
            let headAnimateLen =
                    allImg.zombies[this.zombieType][stateName].head.len,
                bodyAnimateLen =
                    allImg.zombies[this.zombieType][stateName].body.len;

            if (self[stateName].imgIdxHead !== headAnimateLen - 1) {
                self[stateName].countHead += 1;
            }
            self[stateName].countBody += 1;

            self[stateName].imgIdxHead = Math.floor(
                self[stateName].countHead / self[stateName].fps
            );
            self[stateName].imgIdxBody = Math.floor(
                self[stateName].countBody / self[stateName].fps
            );

            if (self[stateName].imgIdxHead === 0) {
                self.head_x = self.x;
                self.head_y = self.y;
                self[stateName].imgHead =
                    self[stateName].images.head[self[stateName].imgIdxHead];
            } else if (self[stateName].imgIdxHead === headAnimateLen) {
                self[stateName].imgHead =
                    self[stateName].images.head[headAnimateLen - 1];
            } else {
                self[stateName].imgHead =
                    self[stateName].images.head[self[stateName].imgIdxHead];
            }

            if (self[stateName].imgIdxBody === bodyAnimateLen) {
                self[stateName].countBody = 0;
                self[stateName].imgIdxBody = 0;

                self.isAnimeLenMax = true;
            } else {
                self.isAnimeLenMax = false;
            }

            if (game.state === game.state_RUNNING) {
                self[stateName].imgBody =
                    self[stateName].images.body[self[stateName].imgIdxBody];
                if (stateName === "dying") {
                    self.x -= self.speed / 17;
                }
            }
        } else if (stateName === "die") {
            let headAnimateLen =
                    allImg.zombies[this.zombieType][stateName].head.len,
                bodyAnimateLen =
                    allImg.zombies[this.zombieType][stateName].body.len;

            if (self[stateName].imgIdxBody !== bodyAnimateLen - 1) {
                self[stateName].countBody += 1;
            }

            self[stateName].imgIdxBody = Math.floor(
                self[stateName].countBody / self[stateName].fps
            );

            if (self[stateName].imgIdxHead === 0) {
                if (self.head_x == 0 && self.head_y == 0) {
                    self.head_x = self.x;
                    self.head_y = self.y;
                }
                self[stateName].imgHead =
                    self[stateName].images.head[headAnimateLen - 1];
            }

            if (self[stateName].imgIdxBody === 0) {
                self[stateName].imgBody =
                    self[stateName].images.body[self[stateName].imgIdxBody];
            } else if (self[stateName].imgIdxBody === bodyAnimateLen - 1) {
                self.isDel = true;
                self[stateName].imgBody =
                    self[stateName].images.body[bodyAnimateLen - 1];
            } else {
                self[stateName].imgBody =
                    self[stateName].images.body[self[stateName].imgIdxBody];
            }
        }
    }

    canAttack() {
        let self = this;

        for (let plant of window._main.plants) {
            if (plant.row === self.row && !plant.isDel) {
                if (self.x - plant.x < -20 && self.x - plant.x > -60) {
                    if (self.life > 2) {
                        self.attackPlantID !== plant.id
                            ? (self.attackPlantID = plant.id)
                            : (self.attackPlantID = self.attackPlantID);
                        self.changeAnimation("attack");
                    } else {
                        self.canMove = false;
                    }
                    if (self.isAnimeLenMax && self.life > 2) {
                        if (plant.life !== 0) {
                            plant.life--;
                            plant.isHurt = true;
                            setTimeout(() => {
                                plant.isHurt = false;

                                if (
                                    plant.life <= 8 &&
                                    plant.section === "wallnut"
                                ) {
                                    plant.life <= 4
                                        ? plant.changeAnimation("idleL")
                                        : plant.changeAnimation("idleM");
                                }

                                if (plant.life <= 0) {
                                    plant.isDel = true;

                                    plant.section === "sunflower" &&
                                        plant.clearSunTimer();
                                }
                            }, 200);
                        }
                    }
                }
            }
        }
    }

    switchState() {
        let self = this,
            state = self.state,
            dictionary = {
                idle: self.state_IDLE,
                run: self.state_RUN,
                attack: self.state_ATTACK,
                dieboom: self.state_DIEBOOM,
                dying: self.state_DYING,
                die: self.state_DIE,
                digest: self.state_DIGEST,
            };
        for (let key in dictionary) {
            if (state === dictionary[key]) {
                return key;
            }
        }
    }

    changeAnimation(action) {
        let self = this,
            stateName = self.switchState(),
            dictionary = {
                idle: self.state_IDLE,
                run: self.state_RUN,
                attack: self.state_ATTACK,
                dieboom: self.state_DIEBOOM,
                dying: self.state_DYING,
                die: self.state_DIE,
                digest: self.state_DIGEST,
            };
        if (action === stateName) return;
        self.state = dictionary[action];
    }
}
