class Game {
    constructor() {
        let g = {
            actions: {},
            keydowns: {},

            cardSection: "",

            state: 0,
            state_LOADING: 0,
            state_START: 1,

            canvas: document.getElementById("canvas"),
            context: document.getElementById("canvas").getContext("2d"),
            timer: null,
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
            cards = window._main.cards,
            img = imageFromPath(allImg.bg);

        cxt.drawImage(img, 0, 0);
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

    setTimer(_main) {
        let g = this,
            plants = _main.plants;

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

            g.drawCards();
        } else if (g.state === g.state_STOP) {
            g.drawBg();

            g.drawCards();
        }
    }

    init() {
        let g = this,
            _main = window._main;
        g.timer = setInterval(function () {
            g.setTimer(_main);
        }, 1000 / g.fps);

        document.getElementById("js-startGame-btn").onclick = function () {
            g.state = g.state_START;
            menuBackground.loop = true;
            menuBackground.play();

            setTimeout(function () {
                g.state = g.state_RUNNING;

                _main.clearTiemr();
                _main.setTimer();
            }, 3000);

            document.getElementsByClassName("cards-list")[0].className +=
                " show";

            document.getElementById("js-startGame-btn").style.display = "none";
        };
    }
}
