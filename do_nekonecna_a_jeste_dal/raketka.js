var raketa = new Image();
x = 10;
y = 150;

function drawRocket(x,y) {
        context.drawImage(raketa, x, y, 90, 45);
        context.fillStyle = "black";
        context.font = "15pt Calibri";
        context.fillText(raketaCislo, 55, y+29);
}

raketa.src = "raketka.png";

function move(e) {
    var key_code = e.which || e.keyCode;
    switch (key_code) {
        case 38:
            if (y == 200) {
                y -= 100;
            } else if (y != 150-50) {
                y -= 50;
            }
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(raketa, x, this.y, 90, 45);
            context.fillText(raketaCislo, 55, this.y+29);
            break;
        case 40:
            if(y == 100) {
                y += 100;
            } else if (y != 150+50) {
                y += 50;
            }
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(raketa, x, this.y, 90, 45);
            context.fillText(raketaCislo, 55, this.y+29);
            break;
    };
}







