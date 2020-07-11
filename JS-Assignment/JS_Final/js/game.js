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
            state_LOADING: 0,
            state_START: 1,
            state_RUNNING: 2,
            state_STOP: 3,
            canvas: document.getElementById("canvas"),
            context: document.getElementById("canvas").getContext("2d"),
            timer: null,
            fps: window._main.fps,
        };
        Object.assign(this, g);
    }

    static new() {
        let g = new this();
        g.init();
        return g;
    }

    clearGameTimer() {
        let g = this;
        clearInterval(g.timer);
    }

    drawBg() {
        let g = this,
            cxt = g.context,
            sunnum = window._main.sunnum,
            cards = window._main.cards,
            img = imageFromPath(allImg.bg);

        cxt.drawImage(img, 0, 0);

        sunnum.draw(cxt);
    }

    drawCards() {
        let g = this,
            cxt = g.context,
            cards = window._main.cards;

        for (let card of cards) {
            card.draw(cxt);
        }
    }

    drawLoading() {
        let g = this,
            cxt = g.context,
            img = imageFromPath(allImg.startBg);

        cxt.drawImage(img, 119, 0);
    }

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

        loading.imgIdx = Math.floor(loading.count / loading.fps);

        if (loading.imgIdx === animateLen) {
            loading.img = loading.images[loading.imgIdx - 1];
        } else {
            loading.img = loading.images[loading.imgIdx];
        }

        cxt.drawImage(loading.img, 437, 246);
    }

    drawBullets(plants) {
        let g = this,
            context = g.context,
            canvas_w = g.canvas.width - 440;
        for (let item of plants) {
            item.bullets.forEach(function (bullet, idx, arr) {
                bullet.draw(g, context);

                if (bullet.x >= canvas_w) {
                    arr.splice(idx, 1);
                }
            });
        }
    }

    drawBlood(role) {
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

    updateImage(plants, zombies) {
        let g = this,
            cxt = g.context;
        plants.forEach(function (plant, idx) {
            plant.canAttack();

            plant.update(g);
        });
    }

    drawImage(plants, zombies) {
        let g = this,
            cxt = g.context,
            delPlantsArr = [];
        plants.forEach(function (plant, idx, arr) {
            if (plant.isDel) {
                delPlantsArr.push(plant);
                arr.splice(idx, 1);
            } else {
                plant.draw(cxt);
            }
        });
    }

    getMousePos() {
        let g = this,
            _main = window._main,
            cxt = g.context,
            cards = _main.cards,
            x = g.mouseX,
            y = g.mouseY;

        if (g.canDrawMousePlant) {
            g.mousePlantCallback(x, y);
        }
    }

    mousePlantCallback(x, y) {
        let g = this,
            _main = window._main,
            cxt = g.context,
            row = Math.floor((y - 75) / 100) + 1,
            col = Math.floor((x - 175) / 80) + 1;

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

        if (row >= 1 && row <= 5 && col >= 1 && col <= 9) {
            g.canLayUp = true;

            for (let plant of _main.plants) {
                if (row === plant.row && col === plant.col) {
                    g.canLayUp = false;
                }
            }
        } else {
            g.canLayUp = false;
        }

        if (g.canDrawMousePlant) {
            g.drawMousePlant(plant_info);
        }
    }

    drawMousePlant(plant_info) {
        let g = this,
            cxt = g.context,
            plant = null,
            mousePlant_info = {
                type: "plant",
                section: g.cardSection,
                x: g.mouseX + 82,
                y: g.mouseY - 40,
                row: g.mouseRow,
                col: g.mouseCol,
            };

        if (g.canLayUp) {
            plant = Plant.new(plant_info);
            plant.isHurt = true;
            plant.update(g);
            plant.draw(cxt);
        }

        g.mousePlant = Plant.new(mousePlant_info);
        g.mousePlant.update(g);
        g.mousePlant.draw(cxt);
    }

    registerAction(key, callback) {
        this.actions[key] = callback;
    }

    setTimer(_main) {
        let g = this,
            plants = _main.plants,
            zombies = _main.zombies;

        let actions = Object.keys(g.actions);
        for (let i = 0; i < actions.length; i++) {
            let key = actions[i];
            if (g.keydowns[key]) {
                g.actions[key]();
            }
        }

        g.context.clearRect(0, 0, g.canvas.width, g.canvas.height);
        if (g.state === g.state_LOADING) {
            g.drawLoading();
        } else if (g.state === g.state_START) {
            g.drawBg();

            g.drawCards();

            g.drawStartAnime();
        } else if (g.state === g.state_RUNNING) {
            g.drawBg();

            g.updateImage(plants, zombies);

            g.drawImage(plants, zombies);

            g.drawCards();

            g.drawBullets(plants);

            g.getMousePos();
        } else if (g.state === g.state_STOP) {
            g.drawBg();

            g.updateImage(plants, zombies);

            g.drawImage(plants, zombies);

            g.drawCards();

            g.drawBullets(plants);

            _main.clearTiemr();
        }
    }

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

        g.timer = setInterval(function () {
            g.setTimer(_main);
        }, 1000 / g.fps);

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

            g.mouseX = x;
            g.mouseY = y;
        };

        document.getElementById("js-startGame-btn").onclick = function () {
            menuBackground.loop = true;
            menuBackground.play();

            g.state = g.state_START;

            setTimeout(function () {
                g.state = g.state_RUNNING;
                _main.clearTiemr();
                _main.setTimer();
            }, 3000);

            document.getElementsByClassName("cards-list")[0].className +=
                " show";

            document.getElementsByClassName("menu-box")[0].className += " show";

            document.getElementById("js-startGame-btn").style.display = "none";
        };

        document.querySelectorAll(".cards-item").forEach(function (card, idx) {
            card.onclick = function () {
                let plant = null,
                    cards = _main.cards;

                if (cards[idx].canClick) {
                    g.cardSection = this.dataset.section;

                    g.canDrawMousePlant = true;

                    g.cardSunVal = {
                        idx: idx,
                        val: cards[idx].sun_val,
                    };
                }
            };
        });

        document.getElementById("canvas").onclick = function (event) {
            let plant = null,
                cards = _main.cards,
                x = g.mouseX,
                y = g.mouseY,
                plant_info = {
                    type: "plant",
                    section: g.cardSection,
                    x: _main.plants_info.x + 80 * (g.mouseCol - 1),
                    y: _main.plants_info.y + 100 * (g.mouseRow - 1),
                    row: g.mouseRow,
                    col: g.mouseCol,
                    canSetTimer: g.cardSection === "sunflower" ? true : false,
                };

            for (let item of _main.plants) {
                if (g.mouseRow === item.row && g.mouseCol === item.col) {
                    g.canLayUp = false;
                    g.mousePlant = null;
                }
            }

            if (g.canLayUp && g.canDrawMousePlant) {
                let cardSunVal = g.cardSunVal;
                if (cardSunVal.val <= _main.allSunVal) {
                    cards[cardSunVal.idx].canClick = false;

                    cards[cardSunVal.idx].changeState();

                    cards[cardSunVal.idx].drawCountDown();

                    plant = Plant.new(plant_info);
                    _main.plants.push(plant);

                    _main.sunnum.changeSunNum(-cardSunVal.val);

                    g.canDrawMousePlant = false;
                } else {
                    g.canDrawMousePlant = false;

                    g.mousePlant = null;
                }
            } else {
                g.canDrawMousePlant = false;

                g.mousePlant = null;
            }
        };
    }
}
