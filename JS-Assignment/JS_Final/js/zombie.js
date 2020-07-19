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
            speed: 3,
            head_x: 0,
            head_y: 0,
            state_IDLE: 1,
            state_RUN: 2,
            state_ATTACK: 3,
            state_DIEBOOM: 4,
            state_DYING: 5,
            state_DIE: 6,
            state_DIGEST: 7,
            zombieType: type,
        };
        Object.assign(this, z);
    }
    // Create and initialize the current object
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
    // initialization
    init() {
        let self = this;
        // idle
        self.idle = Animation.new(self, "idle", 12);
        // moving
        self.run = Animation.new(self, "run", 12);
        // attack
        self.attack = Animation.new(self, "attack", 8);
        // Blow up
        self.dieboom = Animation.new(self, "dieboom", 8);
        // Dying
        self.dying = Animation.new(self, "dying", 8);
        // death
        self.die = Animation.new(self, "die", 12);
    }
    // Drawing method
    draw(cxt) {
        let self = this,
            stateName = self.switchState();
        if (stateName !== "dying" && stateName !== "die") {
            // Draw normal animation
            if (!self.isHurt) {
                // When not injured, draw normal animation
                cxt.drawImage(self[stateName].img, self.x, self.y);
            } else {
                // When injured, draw animation with transparency
                cxt.globalAlpha = 0.5;
                cxt.beginPath();
                cxt.drawImage(self[stateName].img, self.x, self.y);
                cxt.closePath();
                cxt.save();
                cxt.globalAlpha = 1;
            }
        } else {
            // Draw dying, death animation
            if (!self.isHurt) {
                // When not injured, draw normal animation
                cxt.drawImage(
                    self[stateName].imgHead,
                    self.head_x + 70,
                    self.head_y - 10
                );
                cxt.drawImage(self[stateName].imgBody, self.x, self.y);
            } else {
                // When injured, draw animation with transparency
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
    // update status
    update(game) {
        let self = this,
            stateName = self.switchState();
        // Can update status value be moved
        self.canMove ? (self.speed = 3) : (self.speed = 0);
        // Update zombie column coordinates
        self.col = Math.floor((self.x - window._main.zombies_info.x) / 80 + 1);
        if (stateName !== "dying" && stateName !== "die") {
            // General animation (standing, moving, attacking)
            // Modify the current animation sequence length
            let animateLen = allImg.zombies[this.zombieType][stateName].len;
            // Cumulative animation counter
            self[stateName].count += 1;
            // Set the character animation speed
            self[stateName].imgIdx = Math.floor(
                self[stateName].count / self[stateName].fps
            );
            // Reset the animation counter after a set of animations is completed
            if (self[stateName].imgIdx === animateLen) {
                self[stateName].count = 0;
                self[stateName].imgIdx = 0;
                if (stateName === "dieboom") {
                    // After the death animation is executed for one round, remove the current character
                    self.isDel = true;
                }
                // The current number of animation frames reaches the maximum
                self.isAnimeLenMax = true;
            } else {
                self.isAnimeLenMax = false;
            }
            // Game running status
            if (game.state === game.stateRunning) {
                // Set the current frame animation object
                self[stateName].img =
                    self[stateName].images[self[stateName].imgIdx];
                if (stateName === "run") {
                    // When the zombie moves, control the movement speed
                    self.x -= self.speed / 17;
                }
            }
        } else if (stateName === "dying") {
            // Dying animation, including two animation objects
            let headAnimateLen =
                    allImg.zombies[this.zombieType][stateName].head.len,
                bodyAnimateLen =
                    allImg.zombies[this.zombieType][stateName].body.len;
            if (self[stateName].imgIdxHead !== headAnimateLen - 1) {
                self[stateName].countHead += 1;
            }
            self[stateName].countBody += 1;
            // Set the character animation speed
            self[stateName].imgIdxHead = Math.floor(
                self[stateName].countHead / self[stateName].fps
            );
            self[stateName].imgIdxBody = Math.floor(
                self[stateName].countBody / self[stateName].fps
            );
            // Set the current frame animation object, head animation
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
            // Set the current frame animation object, body animation
            if (self[stateName].imgIdxBody === bodyAnimateLen) {
                self[stateName].countBody = 0;
                self[stateName].imgIdxBody = 0;
                // The current number of animation frames reaches the maximum
                self.isAnimeLenMax = true;
            } else {
                self.isAnimeLenMax = false;
            }
            // Game running status
            if (game.state === game.stateRunning) {
                // Set the current frame animation object
                self[stateName].imgBody =
                    self[stateName].images.body[self[stateName].imgIdxBody];
                if (stateName === "dying") {
                    // Dying, can move
                    self.x -= self.speed / 17;
                }
            }
        } else if (stateName === "die") {
            // Death animation, contains two animation objects
            let headAnimateLen =
                    allImg.zombies[this.zombieType][stateName].head.len,
                bodyAnimateLen =
                    allImg.zombies[this.zombieType][stateName].body.len;
            // Cumulative animation counter
            if (self[stateName].imgIdxBody !== bodyAnimateLen - 1) {
                self[stateName].countBody += 1;
            }
            // Set the character animation speed
            self[stateName].imgIdxBody = Math.floor(
                self[stateName].countBody / self[stateName].fps
            );
            // Set the current frame animation object, death state, stop the head animation
            if (self[stateName].imgIdxHead === 0) {
                if (self.head_x == 0 && self.head_y == 0) {
                    self.head_x = self.x;
                    self.head_y = self.y;
                }
                self[stateName].imgHead =
                    self[stateName].images.head[headAnimateLen - 1];
            }
            // Set the current frame animation object, body animation
            if (self[stateName].imgIdxBody === 0) {
                self[stateName].imgBody =
                    self[stateName].images.body[self[stateName].imgIdxBody];
            } else if (self[stateName].imgIdxBody === bodyAnimateLen - 1) {
                // After the death animation is executed for one round, remove the current character
                self.isDel = true;
                self[stateName].imgBody =
                    self[stateName].images.body[bodyAnimateLen - 1];
            } else {
                self[stateName].imgBody =
                    self[stateName].images.body[self[stateName].imgIdxBody];
            }
        }
    }
    // Detect whether zombies can attack plants
    canAttack() {
        let self = this;
        for (let plant of window._main.plants) {
            if (plant.row === self.row && !plant.isDel) {
                // When zombies and plant are near to each other
                if (self.x - plant.x < -20 && self.x - plant.x > -60) {
                    if (self.life > 2) {
                        // Save the  value of the current attacking plant, when the plant is deleted, then control the current zombie movement
                        self.attackPlantID !== plant.id
                            ? (self.attackPlantID = plant.id)
                            : (self.attackPlantID = self.attackPlantID);
                        self.changeAnimation("attack");
                    } else {
                        self.canMove = false;
                    }
                    if (self.isAnimeLenMax && self.life > 2) {
                        // Every time a zombie animation is executed
                        // deduct plant health
                        if (plant.life !== 0) {
                            plant.life--;
                            plant.isHurt = true;
                            setTimeout(() => {
                                plant.isHurt = false;
                                // wallnut animations
                                if (
                                    plant.life <= 8 &&
                                    plant.section === "wallnut"
                                ) {
                                    plant.life <= 4
                                        ? plant.changeAnimation("idleL")
                                        : plant.changeAnimation("idleM");
                                }
                                // Determine if the plant is dead and removed if dead
                                if (plant.life <= 0) {
                                    // Set plant death
                                    plant.isDel = true;
                                    // Clear sunlight generation timer for dead sunflowers
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
    /**
     * Judge the character status and return the corresponding animation object name method
     */
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
    /**
     * Switch character animation
     * action => action type
     * -idle: stand still
     * -attack: attack
     * -die: death
     * -dying: dying
     * -dieboom: explode
     * -digest: Digested
     */
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
