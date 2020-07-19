class Game {
    constructor() {
        let g = {
            actions: {},
            keydowns: {},
            cardSunVal: null,
            cardSection: "",
            canDrawMousePlant: false,
            canLayUp: false,
            mousePlant: null,
            mouseX: 0,
            mouseY: 0,
            mouseRow: 0,
            mouseCol: 0,
            state: 0,
            stateLoading: 0,
            stateStart: 1,
            stateRunning: 2,
            stateStop: 3,
            statePlantWon: 4,
            stateZombieWon: 5,
            canvas: document.getElementById("canvas"),
            context: document.getElementById("canvas").getContext("2d"),
            timer: null,
            fps: window._main.fps,
        };
        Object.assign(this, g);
    }
    // Create and initialize the current object
    static new() {
        let g = new this();
        g.init();
        return g;
    }
    // Clear current game timer
    clearGameTimer() {
        let g = this;
        clearInterval(g.timer);
    }
    // Draw a background and sun number
    drawBg() {
        let g = this,
            cxt = g.context,
            sunnum = window._main.sunnum,
            cards = window._main.cards,
            img = imageFromPath(allImg.bg);
        cxt.drawImage(img, 0, 0);
        sunnum.draw(cxt);
    }
    // Draw a weeder car
    drawCars() {
        let g = this,
            cxt = g.context,
            cars = window._main.cars;
        cars.forEach(function (car, idx) {
            if (car.x > 950) {
                // Remove used cars
                cars.splice(idx, 1);
            }
            car.draw(g, cxt);
        });
    }

    // Draw a plant card
    drawCards() {
        let g = this,
            cxt = g.context,
            cards = window._main.cards;
        for (let card of cards) {
            card.draw(cxt);
        }
    }

    // Draw player victory
    drawPlantWon() {
        let g = this,
            cxt = g.context,
            text = "CONGRATULATION !!!";
        cxt.fillStyle = "blue";
        cxt.font = "48px Microsoft YaHei";
        cxt.fillText(text, 354, 300);
    }

    // Draw a zombie victory
    drawZombieWon() {
        let g = this,
            cxt = g.context,
            img = imageFromPath(allImg.zombieWon);
        cxt.drawImage(img, 293, 66);
    }

    // Draw  first  loading screen
    drawLoading() {
        let g = this,
            cxt = g.context,
            img = imageFromPath(allImg.startBg);
        // Draw loading picture
        cxt.drawImage(img, 119, 0);
    }

    // Draw Start animation
    drawStartAnime() {
        let g = this,
            stateName = "write",
            loading = window._main.loading,
            cxt = g.context,
            canvas_w = g.canvas.width,
            canvas_h = g.canvas.height,
            animateLen = allImg.loading[stateName].len;
        if (loading.imgIdx !== animateLen) {
            loading.count += 1;
        }
        // Set the character animation speed
        loading.imgIdx = Math.floor(loading.count / loading.fps);
        // After completing a set of animations, reset the animation counter and set the animation object of the current frame
        if (loading.imgIdx === animateLen) {
            loading.img = loading.images[loading.imgIdx - 1];
        } else {
            loading.img = loading.images[loading.imgIdx];
        }
        // Draw Start animation
        cxt.drawImage(loading.img, 437, 246);
    }

    // Draw bullets
    drawBullets(plants) {
        let g = this,
            context = g.context,
            canvas_w = g.canvas.width - 440;
        for (let item of plants) {
            item.bullets.forEach(function (bullet, idx, arr) {
                bullet.draw(g, context);
                // Remove bullets beyond range
                if (bullet.x >= canvas_w) {
                    arr.splice(idx, 1);
                }
            });
        }
    }

    // Draw character health
    drawHealth(role) {
        let g = this,
            cxt = g.context,
            x = role.x,
            y = role.y;
        cxt.fillStyle = "red";
        cxt.font = "18px Microsoft YaHei";
        if (role.type === "plant") {
            cxt.fillText(role.life, x + 30, y - 10);
        } else if (role.type === "zombie") {
            cxt.fillText(role.life, x + 85, y + 10);
        }
    }

    // Update character status
    updateImage(plants, zombies) {
        let g = this,
            cxt = g.context;
        plants.forEach(function (plant, idx) {
            // Determine whether to enter the attack state
            plant.canAttack();
            // update status
            plant.update(g);
        });
        zombies.forEach(function (zombie, idx) {
            if (zombie.x < 50) {
                // Zombies reach the house and win
                g.state = g.stateZombieWon;
            }
            // Determine whether to enter the attack state
            zombie.canAttack();
            // update status
            zombie.update(g);
        });
    }
    // Draw character
    drawImage(plants, zombies) {
        let g = this,
            cxt = g.context,
            delPlantsArr = [];
        plants.forEach(function (plant, idx, arr) {
            if (plant.isDel) {
                // Remove dead plants
                delPlantsArr.push(plant);
                arr.splice(idx, 1);
            } else {
                // Draw undead characters
                plant.draw(cxt);
                g.drawHealth(plant);
            }
        });
        zombies.forEach(function (zombie, idx) {
            if (zombie.isDel) {
                // Remove dead zombie
                zombies.splice(idx, 1);
                // when all zombies are dead player win
                if (zombies.length === 0) {
                    g.state = g.statePlantWon;
                }
            } else {
                // Draw zombie with health
                zombie.draw(cxt);
                g.drawHealth(zombie);
            }
            // Make zombies move correctly after the plant dies
            for (let plant of delPlantsArr) {
                if (zombie.attackPlantID === plant.id) {
                    zombie.canMove = true;
                    if (zombie.life > 2) {
                        zombie.changeAnimation("run");
                    }
                }
            }
        });
    }
    // Detect current mouse movement coordinates and handle related events
    getMousePos() {
        let g = this,
            _main = window._main,
            cxt = g.context,
            cards = _main.cards,
            x = g.mouseX,
            y = g.mouseY;
        // Mouse movement to draw plants
        if (g.canDrawMousePlant) {
            g.mousePlantCallback(x, y);
        }
    }
    // Mouse movement to draw plants
    mousePlantCallback(x, y) {
        let g = this,
            _main = window._main,
            cxt = g.context,
            row = Math.floor((y - 75) / 100) + 1, // Define row coordinates
            col = Math.floor((x - 175) / 80) + 1; // Define column coordinates
        // Drawing plant information
        let plant_info = {
            type: "plant",
            section: g.cardSection,
            x: _main.plants_info.x + 80 * (col - 1),
            y: _main.plants_info.y + 100 * (row - 1),
            row: row,
            col: col,
        };
        g.mouseRow = row;
        g.mouseCol = col;
        // Determine if it is in a plantable area
        if (row >= 1 && row <= 5 && col >= 1 && col <= 9) {
            g.canLayUp = true;
            // Determine whether plants can be placed at the current location
            for (let plant of _main.plants) {
                if (row === plant.row && col === plant.col) {
                    g.canLayUp = false;
                }
            }
        } else {
            g.canLayUp = false;
        }
        // Draw a plant function that moves with the mouse
        if (g.canDrawMousePlant) {
            g.drawMousePlant(plant_info);
        }
    }
    // Drawing plants that move with the mouse
    drawMousePlant(plant_info) {
        let g = this,
            cxt = g.context,
            plant = null,
            mousePlant_info = {
                // Move plant information with mouse
                type: "plant",
                section: g.cardSection,
                x: g.mouseX + 82,
                y: g.mouseY - 40,
                row: g.mouseRow,
                col: g.mouseCol,
            };
        // Determine whether to allow placement
        if (g.canLayUp) {
            // Draw translucent plants
            plant = Plant.new(plant_info);
            plant.isHurt = true;
            plant.update(g);
            plant.draw(cxt);
        }
        // Drawing plants that move with the mouse
        g.mousePlant = Plant.new(mousePlant_info);
        g.mousePlant.update(g);
        g.mousePlant.draw(cxt);
    }
    registerAction(key, callback) {
        this.actions[key] = callback;
    }
    // Set frame-by-frame animation
    setTimer(_main) {
        let g = this,
            // Array of plant objects
            plants = _main.plants,
            // Zombie object array
            zombies = _main.zombies;
        // Event collection
        let actions = Object.keys(g.actions);
        for (let i = 0; i < actions.length; i++) {
            let key = actions[i];
            if (g.keydowns[key]) {
                // If the button is pressed, call the registered action
                g.actions[key]();
            }
        }
        // Clear canvas
        g.context.clearRect(0, 0, g.canvas.width, g.canvas.height);
        if (g.state === g.stateLoading) {
            g.drawLoading();
        } else if (g.state === g.stateStart) {
            g.drawBg();
            g.drawCars();
            g.drawCards();
            g.drawStartAnime();
        } else if (g.state === g.stateRunning) {
            g.drawBg();
            g.updateImage(plants, zombies);
            g.drawImage(plants, zombies);
            g.drawCars();
            g.drawCards();
            g.drawBullets(plants);
            g.getMousePos();
        } else if (g.state === g.stateStop) {
            g.drawBg();
            g.updateImage(plants, zombies);
            g.drawImage(plants, zombies);
            g.drawCars();
            g.drawCards();
            g.drawBullets(plants);
            _main.clearTiemr();
        } else if (g.state === g.statePlantWon) {
            menuBackground.pause();
            plantWon.play();
            g.drawBg();
            g.drawCars();
            g.drawCards();
            g.drawPlantWon();
            _main.clearTiemr();
            clearInterval(g.timer);
            window.level++;
            if (window.level >= 4) {
                window.level = 3;
                return;
            }

            setTimeout(() => {
                console.log("Going to another level");
                window.takeMeHome();
                return;
            }, 7000);

            // upto level 3 this one runs!
        } else if (g.state === g.stateZombieWon) {
            menuBackground.pause();
            zombieWon.play();
            zombieWon.loop = false;
            g.drawBg();
            g.drawCars();
            g.drawCards();
            g.drawZombieWon();
            _main.clearTiemr();
        }
    }
    /**
     * Initialization function
     * _main: Game entry function object
     */
    init() {
        let g = this,
            _main = window._main;
        window.addEventListener("keydown", function (event) {
            g.keydowns[event.keyCode] = "down";
        });
        window.addEventListener("keyup", function (event) {
            g.keydowns[event.keyCode] = "up";
        });
        g.registerAction = function (key, callback) {
            g.actions[key] = callback;
        };
        // Set polling timer
        g.timer = setInterval(function () {
            g.setTimer(_main);
        }, 1000 / g.fps);
        // Register mouse movement events
        document.getElementById("canvas").onmousemove = function (event) {
            let e = event || window.event,
                scrollX =
                    document.documentElement.scrollLeft ||
                    document.body.scrollLeft,
                scrollY =
                    document.documentElement.scrollTop ||
                    document.body.scrollTop,
                x = e.pageX || e.clientX + scrollX,
                y = e.pageY || e.clientY + scrollY;
            // Set current mouse coordinate position
            g.mouseX = x;
            g.mouseY = y;
        };
        // Start game button click event
        document.getElementById("js-startGame-btn").onclick = function () {
            menuBackground.loop = true;
            menuBackground.play();
            document.getElementById("restartGame").style.display = "block";
            document.getElementById("goHome").style.display = "block";
            document.getElementsByClassName("cards-list")[0].style.display =
                "block";

            // Play Start animation
            g.state = g.stateStart;
            // Set a timer to switch to the start game state
            setTimeout(function () {
                g.state = g.stateRunning;
                // Show control buttons
                document.getElementById("goHome").className += " show";
                document.getElementById("restartGame").className += " show";
                document.getElementsByClassName("systemSun")[0].style.display =
                    "block";
                // Set the global sun and zombie timer
                _main.clearTiemr();
                _main.setTimer();
            }, 3000);
            // Display card list information
            document.getElementsByClassName("cards-list")[0].className +=
                " show";
            // Show control button menu
            document.getElementsByClassName("menu-box")[0].className += " show";
            // Hide start game button, game introduction, view update log button
            document.getElementById("js-startGame-btn").style.display = "none";
        };
        // Plant card click event
        document.querySelectorAll(".cards-item").forEach(function (card, idx) {
            card.onclick = function () {
                let plant = null, // Mouse to place plant objects
                    cards = _main.cards;
                // When the card is clickable
                if (cards[idx].canClick) {
                    // Set the current plant category with the mouse
                    g.cardSection = this.dataset.section;
                    // Can draw plants with mouse
                    g.canDrawMousePlant = true;
                    // Set the idx of the currently selected plant card and the amount of sunlight required
                    g.cardSunVal = {
                        idx: idx,
                        val: cards[idx].sunVal,
                    };
                }
            };
        });
        // Mouse click on canvas event
        document.getElementById("canvas").onclick = function (event) {
            let plant = null, // Mouse to place plant objects
                cards = _main.cards,
                x = g.mouseX,
                y = g.mouseY,
                plant_info = {
                    // Initialization information of mouse placed plant object
                    type: "plant",
                    section: g.cardSection,
                    x: _main.plants_info.x + 80 * (g.mouseCol - 1),
                    y: _main.plants_info.y + 100 * (g.mouseRow - 1),
                    row: g.mouseRow,
                    col: g.mouseCol,
                    canSetTimer: g.cardSection === "sunflower" ? true : false,
                };
            // Determine whether plants can be placed at the current location
            for (let item of _main.plants) {
                if (g.mouseRow === item.row && g.mouseCol === item.col) {
                    g.canLayUp = false;
                    g.mousePlant = null;
                }
            }
            // When placed, draw plants
            if (g.canLayUp && g.canDrawMousePlant) {
                let cardSunVal = g.cardSunVal;
                if (cardSunVal.val <= _main.allSunVal) {
                    // Draw when there is enough sunlight
                    // Disable the current card
                    cards[cardSunVal.idx].canClick = false;
                    // Change the clickable state of the card regularly
                    cards[cardSunVal.idx].changeState();
                    // draw countdown
                    cards[cardSunVal.idx].drawCountDown();
                    // Place corresponding plants
                    plant = Plant.new(plant_info);
                    _main.plants.push(plant);
                    // Change the amount of sunlight
                    _main.sunnum.changeSunNum(-cardSunVal.val);
                    // Prohibit drawing plants that move with the mouse
                    g.canDrawMousePlant = false;
                } else {
                    // Insufficient sunshine
                    // Prohibit drawing plants that move with the mouse
                    g.canDrawMousePlant = false;
                    // Clear to move plant objects with the mouse
                    g.mousePlant = null;
                }
            } else {
                // Prohibit drawing plants that move with the mouse
                g.canDrawMousePlant = false;
                // Clear to move plant objects with the mouse
                g.mousePlant = null;
            }
        };
        // Takes to the game screen again!
        document.getElementById("goHome").onclick = function (event) {
            _main.clearTiemr();
            clearInterval(g.timer);

            window.level = 1;
            window.takeMeHome();
        };
        // Restart game button event
        document.getElementById("restartGame").onclick = function (event) {
            _main.clearTiemr();
            clearInterval(g.timer);
            window.takeMeHome();
        };
    }
}
