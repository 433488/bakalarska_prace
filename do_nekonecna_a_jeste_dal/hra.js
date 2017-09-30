var rocketGame = {},
    score = document.getElementsByClassName('score')[0],
    canvas = document.getElementById("scene"),
    context = canvas.getContext("2d"),
    h2 = document.getElementsByTagName('h2')[0],
    seconds = 0, minutes = 0,
    t,
    rocket = new Image(),
    x = 10,
    y = 150,
    meteor = new Image(),
    rocketNumber = 0,
    axis = [0,0,0],
    speed = 1,
    coordinateX = 450;

rocket.src = "raketka.png";
meteor.src = "meteor.png";

randomize();

function start() {
    clear(context);
    timer();
    rocketGame.background = new Image();
    rocketGame.background.onload = function () {

        window.requestAnimationFrame(gameloop);
    }
    rocketGame.background.onerror = function() {
        console.log("Chyba při načítání obrázku.");
    }
    rocketGame.background.src = "obloha.jpg";
}

function restart() {
    if ($('#popup').hasClass('hide')) {

    } else {
        $("#popup").addClass('hide');
        h2.textContent = "00:00";
        seconds = 0; minutes = 0;
        timer();
        speed = 1;
    };
    randomize();
    randomIntFromInterval(axis[0],axis[2]);
    coordinateX = 450;
}

function clear(ctx) {
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
}

function gameloop() {
        clear(context);
        // zobrazení obrázku na pozadí
        context.drawImage(rocketGame.background, 0, 0);
        drawRocket(x,y);
        movement();
        extract(axis);
        window.requestAnimationFrame(gameloop);
}

function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
        }
    }

    h2.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    timer();
}

function timer() {
    t = setTimeout(add, 1000);
}

function result() {
    if((axis[0] < rocketNumber) && (rocketNumber < axis[1]) && (y == 100)) {
        restart();
        speed += 0.1;
    } else if ((axis[1] < rocketNumber) && (rocketNumber < axis[2]) && (y == 200)) {
        restart();
        speed += 0.1;
    } else {
        clearTimeout(t);
        score.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
        $("#popup").removeClass("hide");
    }
}

function drawRocket(x,y) {
    context.drawImage(rocket, x, y, 90, 45);
    context.fillStyle = "black";
    context.font = "15pt Calibri";
    context.fillText(rocketNumber, 55, y+29);
}

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
            context.drawImage(rocket, x, this.y, 90, 45);
            context.fillText(rocketNumber, 55, this.y+29);
            break;
        case 40:
            if(y == 100) {
                y += 100;
            } else if (y != 150+50) {
                y += 50;
            }
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(rocket, x, this.y, 90, 45);
            context.fillText(rocketNumber, 55, this.y+29);
            break;
    };
}

//generator nahodnych cisel pro raketku
function randomIntFromInterval(min,max) {
    do {
        rocketNumber = Math.floor(Math.random()*(max-min+1)+min);
    }
    while ((rocketNumber == axis[0]) || (rocketNumber == axis[1]) || (rocketNumber == axis[2]))
}

randomIntFromInterval(axis[0],axis[2]);

//generator nahodnych cisel pro meteority
function randomize() {
    for (var i = 0; i < axis.length; i++){
        axis[i] = Math.floor(Math.random() * 100 + 1);
    }

    var correct;
    do {
        correct = true;
        for (var i = 0; i < axis.length; i++) {
            for (var j = 0; j < axis.length; j++) {
                if (((i != j) && (axis[i] == axis[j])) || (axis[i]-1 == axis[j]) || (axis[i]+1 == axis[j])) {
                    axis[i] = Math.floor(Math.random() * 100 + 1);
                    correct = false;
                }
            }
        }
    } while(!correct)

    axis.sort(function(a,b) {return a-b});
}

function movement()  {
    if(coordinateX < 90) {
        result();
    } else {
        coordinateX -= speed;
    }
}

function extract(arr) {
    for (var i = 0; i < arr.length; i++) {
        console.log(arr[i]);
        context.font = "25pt Calibri";
        context.fillStyle = "#ffffff";
        context.drawImage(meteor, coordinateX-15, (i+1)* 95-45, 70, 70);
        context.fillText(arr[i], coordinateX, (i+1) * 95);

    };
}









