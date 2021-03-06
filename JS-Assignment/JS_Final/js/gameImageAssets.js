const imageFromPath = function (src) {
    let img = new Image();
    img.src = "./images/" + src;
    return img;
};
// Native animation parameters
const keyframesOptions = {
    iterations: 1,
    iterationStart: 0,
    delay: 0,
    endDelay: 0,
    direction: "alternate",
    duration: 3000,
    fill: "forwards",
    easing: "ease-out",
};
// Image material path
const allImg = {
    startBg: "coverBg.jpg",
    bg: "background1.jpg",
    bullet: "bullet.png",
    bulletHit: "bullet_hit.png",
    sunback: "sunback.png",
    zombieWon: "zombieWon.png",
    car: "car.png",
    loading: {
        write: {
            path: "loading/loading_*.png",
            len: 4,
        },
    },
    plantsCard: {
        sunflower: {
            img: "cards/plants/SunFlower.png",
            imgG: "cards/plants/SunFlowerG.png",
        },
        peashooter: {
            img: "cards/plants/Peashooter.png",
            imgG: "cards/plants/PeashooterG.png",
        },
        repeater: {
            img: "cards/plants/Repeater.png",
            imgG: "cards/plants/RepeaterG.png",
        },
        gatlingpea: {
            img: "cards/plants/GatlingPea.png",
            imgG: "cards/plants/GatlingPeaG.png",
        },
        cherrybomb: {
            img: "cards/plants/CherryBomb.png",
            imgG: "cards/plants/CherryBombG.png",
        },
        wallnut: {
            img: "cards/plants/WallNut.png",
            imgG: "cards/plants/WallNutG.png",
        },
        chomper: {
            img: "cards/plants/Chomper.png",
            imgG: "cards/plants/ChomperG.png",
        },
    },
    plants: {
        sunflower: {
            idle: {
                path: "plants/sunflower/idle/idle_*.png",
                len: 18,
            },
        },
        peashooter: {
            idle: {
                path: "plants/peashooter/idle/idle_*.png",
                len: 8,
            },
            attack: {
                path: "plants/peashooter/attack/attack_*.png",
                len: 8,
            },
        },
        repeater: {
            idle: {
                path: "plants/repeater/idle/idle_*.png",
                len: 15,
            },
            attack: {
                path: "plants/repeater/attack/attack_*.png",
                len: 15,
            },
        },
        gatlingpea: {
            idle: {
                path: "plants/gatlingpea/idle/idle_*.png",
                len: 13,
            },
            attack: {
                path: "plants/gatlingpea/attack/attack_*.png",
                len: 13,
            },
        },
        cherrybomb: {
            idle: {
                path: "plants/cherrybomb/idle/idle_*.png",
                len: 7,
            },
            attack: {
                path: "plants/cherrybomb/attack/attack_*.png",
                len: 5,
            },
        },
        wallnut: {
            idleH: {
                path: "plants/wallnut/idleH/idleH_*.png",
                len: 16,
            },
            idleM: {
                path: "plants/wallnut/idleM/idleM_*.png",
                len: 11,
            },
            idleL: {
                path: "plants/wallnut/idleL/idleL_*.png",
                len: 15,
            },
        },
        chomper: {
            idle: {
                path: "plants/chomper/idle/idle_*.png",
                len: 13,
            },
            attack: {
                path: "plants/chomper/attack/attack_*.png",
                len: 8,
            },
            digest: {
                path: "plants/chomper/digest/digest_*.png",
                len: 6,
            },
        },
    },
    zombies: {
        type1: {
            idle: {
                path: "zombies/zombie1/idle/idle_*.png",
                len: 31,
            },
            run: {
                path: "zombies/zombie1/run/run_*.png",
                len: 31,
            },
            attack: {
                path: "zombies/zombie1/attack/attack_*.png",
                len: 21,
            },
            dieboom: {
                path: "zombies/zombie1/dieboom/dieboom_*.png",
                len: 20,
            },
            dying: {
                head: {
                    path: "zombies/zombie1/dying/head/head_*.png",
                    len: 12,
                },
                body: {
                    path: "zombies/zombie1/dying/body/body_*.png",
                    len: 18,
                },
            },
            die: {
                head: {
                    path: "zombies/zombie1/dying/head/head_*.png",
                    len: 12,
                },
                body: {
                    path: "zombies/zombie1/die/die_*.png",
                    len: 10,
                },
            },
        },
        type2: {
            idle: {
                path: "zombies/zombie2/idle/idle_*.png",
                len: 20,
            },
            run: {
                path: "zombies/zombie2/run/run_*.png",
                len: 30,
            },
            attack: {
                path: "zombies/zombie2/attack/attack_*.png",
                len: 10,
            },
            dieboom: {
                path: "zombies/zombie2/dieboom/dieboom_*.png",
                len: 20,
            },
            dying: {
                head: {
                    path: "zombies/zombie2/dying/head/head_*.png",
                    len: 6,
                },
                body: {
                    path: "zombies/zombie2/dying/body/body_*.png",
                    len: 15,
                },
            },
            die: {
                head: {
                    path: "zombies/zombie2/dying/head/head_*.png",
                    len: 6,
                },
                body: {
                    path: "zombies/zombie2/die/die_*.png",
                    len: 15,
                },
            },
        },
    },
};
