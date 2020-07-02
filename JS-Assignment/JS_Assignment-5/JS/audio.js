/*
To play audio based on different instance
*/

// Play when bird successfully passes the obstacle
let score = new Audio();
score.src = "audio/point.wav";

// Play when bird jumps
let flap1 = new Audio();
flap1.src = "audio/flap.wav";

// Play on game over or collision state
let collision = new Audio();
collision.src = "audio/collision.wav";
