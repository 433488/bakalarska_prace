var rocketGame = {};
var score = document.getElementsByClassName('score')[0];
var canvas = document.getElementById("scene");
var context = canvas.getContext("2d");

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
        rychlost = 1;
    };
    nahodna();
    randomIntFromInterval(priklad[0],priklad[2]);
    souradniceX = 450;
}

function clear(ctx) {
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
}

function gameloop() {
        clear(context);
        // zobrazení obrázku na pozadí
        context.drawImage(rocketGame.background, 0, 0);
        drawRocket(x,y);
        posun();
        vypis(priklad);
        window.requestAnimationFrame(gameloop);
}

var h2 = document.getElementsByTagName('h2')[0],
    seconds = 0, minutes = 0,
    t;

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

function vysledek() {
    if((priklad[0] < raketaCislo) && (raketaCislo < priklad[1]) && (y == 100)) {
        restart();
        rychlost += 0.1;
    } else if ((priklad[1] < raketaCislo) && (raketaCislo < priklad[2]) && (y == 200)) {
        restart();
        rychlost += 0.1;
    } else {
        clearTimeout(t);
        score.textContent = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
        $("#popup").removeClass("hide");
    }
}









