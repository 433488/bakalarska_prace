var arrayNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    textQuestion = "",
    idQuestion = 0,
    typeQuestion = "",
    aAnswer = "",
    bAnswer = "",
    cAnswer = "",
    dAnswer = "",
    correctAnswer = [],
    endKeeper = 0,
    xTime = 0;
    doneArray = [],
    actualCardId = 0,
    allQuestions = {};

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
    fetchJSONFile('otazka.json', function (data) {
        allQuestions = data.quiz;
        textQuestion = allQuestions[idQuestion].question;
        typeQuestion = allQuestions[idQuestion].type;
        correctAnswer = allQuestions[idQuestion].correct;
        aAnswer = allQuestions[idQuestion].a;

        if (typeQuestion == "yesNo") {
            bAnswer = allQuestions[idQuestion].b;
        } else if (typeQuestion == "moreAnswer") {
            bAnswer = allQuestions[idQuestion].b;
            cAnswer = allQuestions[idQuestion].c;
        } else if (typeQuestion == "multiple") {
            bAnswer = allQuestions[idQuestion].b;
            cAnswer = allQuestions[idQuestion].c;
            dAnswer = allQuestions[idQuestion].d;
        }
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

function start() {
    var fiveMinutes = 60 * 5,
        display = document.querySelector('#time');
    startTimer(fiveMinutes, display);
    $("#beforeStart").addClass('hide');
    $("#starter").addClass('hide');
    $("#cards").removeClass('hide');
    idQuestion = randomNum();
    load();
}

$(function(){
    $("#over").click(function(){
        window.location.href= '../index.html';
    });
    $("#close").click(function(){
        window.location.href= 'index.html';
    });
});

$(function () {

    for (var i = 1; i < 20; i++) {
        $(".card:first-child").clone().appendTo("#cards");
    }

    // nastavení pozice karet
    $("#cards").children().each(function (index) {
        $(this).css({
            "left": ($(this).width() + 10) * (index % 5),
            "top": ($(this).height() + 10) * Math.floor(index / 5)
        });
        $(this).click(selectCard);
    });

    var cardsElement = document.querySelectorAll('.card');

    for (var i = 0; i < cardsElement.length; i++) {
        cardsElement[i].id = i;
    }
});

function selectCard() {
    doneArray = [];
    // pokud jsou otočené dvě karty, neprovádí se žádné další akce
    if ($(".card-flipped").size() > 0) {
        return;
    }

    if ($("#beforeStart").hasClass('hide')) {
        $(this).addClass("card-flipped");

        //nelze otočit kartu, která již byla vyplněna správně
        if ($(this).hasClass("card-done")) {
            $(this).removeClass("card-flipped");
        }

        //nelze otočit kartu, která již byla vyplněna špatně
        if ($(this).hasClass("card-removed")) {
            $(this).removeClass("card-flipped");
        }

        if ($(".card-flipped").size() == 1) {
            giveQuestion();
        }

    }

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
            document.getElementById("message").innerHTML = "Vypršel čas";
            $("#popup").removeClass('hide');

        }
    }, 1000);
}

//zoprazi prislusny formular podle typu otazky a naplni ho
function giveQuestion() {
    $("#square").removeClass('hide');

    if (typeQuestion == "yesNo") {
        $("#formYesNo").removeClass('hide');
        document.getElementsByClassName("yesNoText")[0].innerHTML = textQuestion;
        document.getElementById("buttonYes").setAttribute('value', aAnswer);
        document.getElementById("buttonNo").setAttribute('value', bAnswer);

    } else if (typeQuestion == "multiple") {
        $("#formMultiple").removeClass('hide');
        document.getElementsByClassName("multipleText")[0].innerHTML = textQuestion;
        document.getElementsByClassName("multipleA")[0].innerHTML = aAnswer;
        document.getElementsByClassName("multipleB")[0].innerHTML = bAnswer;
        document.getElementsByClassName("multipleC")[0].innerHTML = cAnswer;
        document.getElementsByClassName("multipleD")[0].innerHTML = dAnswer;

    } else if (typeQuestion == "count") {
        $("#formCount").removeClass('hide');
        document.getElementsByClassName("countText")[0].innerHTML = textQuestion;

    } else {
        $("#formMoreAnswer").removeClass('hide');
        document.getElementsByClassName("moreText")[0].innerHTML = textQuestion;
        document.getElementsByClassName("moreA")[0].innerHTML = aAnswer;
        document.getElementsByClassName("moreB")[0].innerHTML = bAnswer;
        document.getElementsByClassName("moreC")[0].innerHTML = cAnswer;
    }
}

function checkAnswer(value) {
    $("#square").addClass('hide');
    if (typeQuestion == "yesNo") {
        $("#formYesNo").addClass('hide');
        if (value == correctAnswer) {
            actualCardId = document.getElementsByClassName("card-flipped")[0].id;
            checkGame(actualCardId);
            $(".card-flipped").removeClass("card-flipped").addClass("card-done");

        } else {
            $(".card-flipped").removeClass("card-flipped").addClass("card-removed");
        }

    } else if (typeQuestion == "multiple") {
        $("#formMultiple").addClass('hide');
        var radios = document.getElementsByName('radioAnswer');

        if (!$("input[name='radioAnswer']:checked").val()) {
            $(".card-flipped").removeClass("card-flipped").addClass("card-removed");
        }

        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                if (radios[i].value == correctAnswer) {
                    actualCardId = document.getElementsByClassName("card-flipped")[0].id;
                    checkGame(actualCardId);
                    $(".card-flipped").removeClass("card-flipped").addClass("card-done");
                } else {
                    $(".card-flipped").removeClass("card-flipped").addClass("card-removed");
                }
                radios[i].checked = false;
                break;
            }
        }

    } else if (typeQuestion == "count") {
        $("#formCount").addClass('hide');
        if (document.getElementById("inputCount").value == correctAnswer) {
            actualCardId = document.getElementsByClassName("card-flipped")[0].id;
            checkGame(actualCardId);
            $(".card-flipped").removeClass("card-flipped").addClass("card-done");
        } else {
            $(".card-flipped").removeClass("card-flipped").addClass("card-removed");
        }
        document.getElementById("inputCount").value = "";

    } else {
        var checkarray = [];
        $("#formMoreAnswer").addClass('hide');
        var checkboxs = document.getElementsByName('checkboxAnswer');

        for (var i = 0, length = checkboxs.length; i < length; i++) {
            if (checkboxs[i].checked) {
                checkarray.push(checkboxs[i].value);
                checkboxs[i].checked = false;
            }
        }
        if (checkarray == correctAnswer) {
            actualCardId = document.getElementsByClassName("card-flipped")[0].id;
            checkGame(actualCardId);
            $(".card-flipped").removeClass("card-flipped").addClass("card-done");
        } else {
            $(".card-flipped").removeClass("card-flipped").addClass("card-removed");
        }
    }
    load();
    missedEdge();
}

function checkGame(actualCard) {
    var leftPointId = 0,
        rightPointId = 0,
        topPointId = 0,
        bottomPointId = 0,
        leftPoint = 0,
        rightPoint = 0,
        topPoint = 0,
        bottomPoint = 0,
        newRow = 0,
        newColumn = 0,
        counter = 0,
        newCoordinates = [];
    var column = Math.floor(actualCard / 5);
    var row = actualCard % 5;

        if (doneArray.length > 0) {
            counter = 0;
            newCoordinates = [row, column];
            for (var i = 0; i < doneArray.length; i++) {
                for (var j = 0; j < doneArray[i].length; j+=2) {
                    if (doneArray[i][j] == row  && doneArray[i][j+1] == column) {
                        counter++;
                        break;
                    }
                }
            }
            if (counter == 0){
                doneArray.push([row, column]);
            }

        } else {
            doneArray.push([row, column]);
        }

    if ((column - 1) >= 0) {
        newColumn = column - 1;
        newCoordinates = [row, newColumn];
        leftPointId = (newColumn * 5 + row);
        leftPoint = document.getElementById(leftPointId);
        if (leftPoint.classList.contains("card-done")) {
            counter = 0;
            for (var i = 0; i < doneArray.length; i++) {
                for (var j = 0; j < doneArray[i].length; j+=2) {
                    if (doneArray[i][j] == row  && doneArray[i][j+1] == newColumn) {
                        counter++;
                        break;
                    }
                }
            }
            if (counter == 0) {
                checkGame(leftPointId);
            }
        }
    }

    if ((column + 1) < 4) {
        newColumn = column + 1;
        newCoordinates = [row, newColumn];
        rightPointId = (newColumn * 5 + row);
        rightPoint = document.getElementById(rightPointId);
        if (rightPoint.classList.contains("card-done")) {
            counter = 0;
            for (var i = 0; i < doneArray.length; i++) {
                for (var j = 0; j < doneArray[i].length; j+=2) {
                    if (doneArray[i][j] == row  && doneArray[i][j+1] == newColumn) {
                        counter++;
                        break;
                    }
                }
            }
            if (counter == 0) {
                checkGame(rightPointId);
            }
        }
    }

    if ((row - 1) >= 0) {
        newRow = row - 1;
        newCoordinates = [newRow, column];
        topPointId = (column * 5 + newRow);
        topPoint = document.getElementById(topPointId);
        if (topPoint.classList.contains("card-done")) {
            counter = 0;
            for (var i = 0; i < doneArray.length; i++) {
                for (var j = 0; j < doneArray[i].length; j+=2) {
                    if (doneArray[i][j] == newRow  && doneArray[i][j+1] == column) {
                        counter++;
                        break;
                    }
                }
            }
            if (counter == 0) {
                checkGame(topPointId);
            }
        }
    }

    if ((row + 1) < 5) {
        newRow = row + 1;
        newCoordinates = [newRow, column];
        bottomPointId = (column * 5 + newRow);
        bottomPoint = document.getElementById(bottomPointId);
        if (bottomPoint.classList.contains("card-done")) {
            counter = 0;
            for (var i = 0; i < doneArray.length; i++) {
                for (var j = 0; j < doneArray[i].length; j+=2) {
                    if (doneArray[i][j] == newRow  && doneArray[i][j+1] == column) {
                        counter++;
                        break;
                    }
                }
            }
            if (counter == 0) {
                checkGame(bottomPointId);
            }
        }
    }
    endCounter();

}

function endCounter() {
    var yZero = 0,
        xZero = 0,
        xFour = 0,
        yThree = 0;

    endKeeper = 0;
    for (var i = 0; i < doneArray.length; i++) {
        if (doneArray[i][0] == 0 && xZero == 0) {
            endKeeper++;
            xZero = 1;
        }

        if (doneArray[i][0] == 4 && xFour == 0){
            endKeeper++;
            xFour = 1;
        }
        if (doneArray[i][1] == 0 && yZero == 0){
            endKeeper++;
            yZero = 1;
        }
        if (doneArray[i][1] == 3 && yThree == 0){
            endKeeper++;
            yThree = 1;
        }
    }
    if (endKeeper > 3){
        $("#popup").removeClass('hide');
        clearInterval(xTime);
    }
}

function missedEdge() {
    if ($("#0").hasClass('card-removed') && $("#1").hasClass('card-removed') && $("#2").hasClass('card-removed') && $("#3").hasClass('card-removed') && $("#4").hasClass('card-removed')) {
        document.getElementById("message").innerHTML = "Odstranil sis celou jednu stranu, bohužel již nemůžeš vyhrát.";
        $("#popup").removeClass('hide');
        clearInterval(xTime);
    }

    if ($("#0").hasClass('card-removed') && $("#5").hasClass('card-removed') && $("#10").hasClass('card-removed') && $("#15").hasClass('card-removed')) {
        document.getElementById("message").innerHTML = "Odstranil sis celou jednu stranu, bohužel již nemůžeš vyhrát.";
        $("#popup").removeClass('hide');
        clearInterval(xTime);
    }
    if ($("#15").hasClass('card-removed') && $("#16").hasClass('card-removed') && $("#17").hasClass('card-removed') && $("#18").hasClass('card-removed') && $("#19").hasClass('card-removed')) {
        document.getElementById("message").innerHTML = "Odstranil sis celou jednu stranu, bohužel již nemůžeš vyhrát.";
        $("#popup").removeClass('hide');
        clearInterval(xTime);
    }
    if ($("#4").hasClass('card-removed') && $("#9").hasClass('card-removed') && $("#14").hasClass('card-removed') && $("#19").hasClass('card-removed')) {
        document.getElementById("message").innerHTML = "Odstranil sis celou jednu stranu, bohužel již nemůžeš vyhrát.";
        $("#popup").removeClass('hide');
        clearInterval(xTime);
    }
}







