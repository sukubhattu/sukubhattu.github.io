let phase = 0;
let frameCount = 0;
let numStrands = 5;
let y;

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    frameCount++;
    phase = frameCount * speed;
    var x = 0;
    var colOffset = 0;

    for (let i = 0; i < numStrands; i++) {
        if (i === 0) {
            strandPhase = phase;
        } else {
            strandPhase = phase + i * Math.PI;
        }
        x = 0;

        // Drawing specific numbers of cols in helix
        for (let col = 0; col < colsNum; col++) {
            // x is gap between each column
            x = x + 30;
            colOffset = (col * 2 * Math.PI) / 10;

            // Drawing specific number of circle in each column
            for (let row = 0; row < rowsNum; row += 1) {
                var y =
                    canvas.height / 5 +
                    row * 12 +
                    Math.sin(strandPhase + colOffset) * 50;

                // The radius of circle is not same in all position
                //Changing the radius of the circle variably
                var sizeOffset =
                    (Math.cos(strandPhase - row * 0.1 + colOffset) + 1) * 0.5;
                circleRadius = sizeOffset * maxCircleRadius;

                context.beginPath();
                context.arc(x, y, circleRadius, 0, Math.PI * 2, false);

                // Filling gradient color
                var grd = context.createLinearGradient(0, 0, 200, 0);
                grd.addColorStop(0, "#f9d3a2");
                grd.addColorStop(1, "#d68b9a");
                context.fillStyle = grd;

                context.fill();
                context.closePath();
            }
        }
    }
}

// Calling function which draws helix dots every 25ms
setInterval(draw, 25);
