var miner = new Image(),
    gold = new Image(),
    xTime, part, back, idQuestion, partHour, aAnswer, bAnswer,
    cAnswer, correctAnswer, hour, minute, score,
    edge = 0,
    arrayNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    allQuestions = [];


var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var radius = canvas.height / 2;
ctx.translate(radius, radius);
radius = radius * 0.90;

gold.src = "gold.png";
miner.src = "gold_miner.png";
idQuestion = randomNum();
load();

function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}

function load() {
    fetchJSONFile('time.json', function (data) {
        allQuestions = data.time;
        correctAnswer = allQuestions[idQuestion].correct;
        aAnswer = allQuestions[idQuestion].a;
        bAnswer = allQuestions[idQuestion].b;
        cAnswer = allQuestions[idQuestion].c;

        idQuestion = randomNum();
    });
};

function randomNum() {
    var item = arrayNumber[Math.floor(Math.random() * arrayNumber.length)];
    var index = arrayNumber.indexOf(item);
    if (index > -1) {
        arrayNumber.splice(index, 1);
    }
    return item;
}

function clear(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function start() {
    $("#popup").addClass('hide');
    score = 0;
    clear(ctx);
    $("#starter").addClass('hide')
    $("#score").removeClass('hide');
    $("#countScore").removeClass('hide');
    var oneMinute = 60,
        display = document.querySelector('#time');
    startTimer(oneMinute, display);
    drawClock();
    giveQuestion();
}

function restart() {
    clear(ctx);
    drawClock();
    giveQuestion();
}

function drawClock() {
    drawFace(ctx, radius);
    drawNumbers(ctx, radius);
    drawTime(ctx, radius);
    drawDwarf();
}

function startTimer(duration, display) {
    var timer = duration, minutes, seconds;
    xTime = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(xTime);
            document.getElementById("message").innerHTML = "Vypršel čas.";
            document.getElementsByClassName("score")[0].innerHTML = "Vaše score je: " + score;
            $("#popup").removeClass('hide');
        }
    }, 1000);
}

function drawFace(ctx, radius) {
    var grad;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, 'white');
    grad.addColorStop(1, '#333');
    ctx.strokeStyle = grad;
    ctx.lineWidth = radius * 0.1;
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = '#333';
    ctx.fill();
}

function drawDwarf() {
    ctx.drawImage(miner, -35, -50, 70, 81);
}

function drawNumbers(ctx, radius) {
    var ang,
        num,
        min;
    partHour = correctAnswer.split(":", 2);
    if (partHour[1] == 0) {
        min = 60;
    } else {
        min = partHour[1];
    }

    var angle = (min / 5) * Math.PI / 6;

    ctx.font = radius * 0.15 + "px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for (num = 1; num < 13; num++) {
        ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang);
        if (ang == angle) {
            ctx.drawImage(gold, -17, -16, 36, 32);
        } else {
            ctx.fillText(num.toString(), 0, 0);
        }
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.85);
        ctx.rotate(-ang);
    }
}

function drawTime(ctx, radius) {
    hour = partHour[0];
    minute = partHour[1];
    hour = (hour * Math.PI / 6) +
        (minute * Math.PI / (6 * 60));
    drawHand(ctx, hour, radius * 0.5, radius * 0.03);
}

function drawHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}

function giveQuestion() {
    $("#square").removeClass('hide');
    document.getElementById("button1").setAttribute('value', aAnswer);
    document.getElementById("button2").setAttribute('value', bAnswer);
    document.getElementById("button3").setAttribute('value', cAnswer);
}

function checkAnswer(value) {
    back = 0;
    part = value.split(":", 2);
    $("#square").addClass('hide');
    if (value == correctAnswer) {
        score += 50;
        document.getElementById("countScore").innerHTML = score;
    }
    takeGold();
    load();
}

function takeGold() {
    var position = (part[1]*Math.PI/30);
    if (edge < radius * 0.8 && back == 0) {
        edge += 1;
        drawHand(ctx, position, edge, radius * 0.03);
    } else {
        back = 1;
        if (edge > 0){
            edge -= 1;
            clear(ctx);
            drawClock();
            drawHand(ctx, position, edge, radius * 0.03);
            if (edge == 0) {
                restart();
            }
        }
    }
    requestAnimationFrame(takeGold);
}


