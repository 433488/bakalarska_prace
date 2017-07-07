var meteor = new Image();
var raketaCislo = 0;
var priklad = [0,0,0];
var rychlost = 1;
nahodna();

meteor.src = "meteor.png";

var souradniceX = 450;

//generator nahodnych cisel pro raketku
function randomIntFromInterval(min,max) {
    do {
        raketaCislo = Math.floor(Math.random()*(max-min+1)+min);
    }
    while ((raketaCislo == priklad[0]) || (raketaCislo == priklad[1]) || (raketaCislo == priklad[2]))
}

randomIntFromInterval(priklad[0],priklad[2]);


//generator nahodnych cisel pro meteority
function nahodna() {
    for (var i = 0; i < priklad.length; i++){
        priklad[i] = Math.floor(Math.random() * 100 + 1);
    }

    var correct;
    do {
        correct = true;
        for (var i = 0; i < priklad.length; i++) {
            for (var j = 0; j < priklad.length; j++) {
                if (((i != j) && (priklad[i] == priklad[j])) || (priklad[i]-1 == priklad[j]) || (priklad[i]+1 == priklad[j])) {
                    priklad[i] = Math.floor(Math.random() * 100 + 1);
                    correct = false;
                }
            }
        }
    } while(!correct)

    priklad.sort(function(a,b) {return a-b});

}

function posun()  {
    if(souradniceX < 90) {
        vysledek();
    } else {
        souradniceX -= rychlost;
    }
}

function vypis(arr) {
    for (var i = 0; i < arr.length; i++) {
        console.log(arr[i]);
        context.font = "25pt Calibri";
        context.fillStyle = "#ffffff";
        context.drawImage(meteor, souradniceX-15, (i+1)* 95-45, 70, 70);
        context.fillText(arr[i], souradniceX, (i+1) * 95);

    };
}













