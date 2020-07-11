const imageFromPath = function (src) {
    let img = new Image();
    img.src = "./images/" + src;
    return img;
};

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

        cherrybomb: {
            img: "cards/plants/CherryBomb.png",
            imgG: "cards/plants/CherryBombG.png",
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
    },
};
