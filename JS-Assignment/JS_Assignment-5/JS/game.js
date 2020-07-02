const game1 = new Flappy("bird1");
game1.gameController(32);

let game1loop = () => {
    game1.update();
    game1.draw();

    requestAnimationFrame(game1loop);
};

game1loop();

const game2 = new Flappy("bird2");
game2.gameController(32);

let game2loop = () => {
    game2.update();
    game2.draw();

    requestAnimationFrame(game2loop);
};

game2loop();
