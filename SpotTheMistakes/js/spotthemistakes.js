// the current index in the details array
var index = 0;
var questions;
var answers;
var nonError;
var selected = [];
var image;
var startTime;
var score;
var timerID;
var startGameTime;
// initiation
window.onload = function () {
    
    score = {
        "now": {
            "correct": 0,
            "incorrect": 0,
            "missed": 0
        },
        "total": {
            "correct": 0,
            "incorrect": 0,
            "missed": 0
        }
    };
    startTime = performance.now();
    startGameTime = performance.now();
    image = $('img');
    $.getJSON("js/answers.json", function (result) {
        $.each(result, function (i, field) {
            questions = result.questions;
            answers = questions[index].error;
            nonError = questions[index].nonError;
            $('img').attr("src", questions[0].src);
        });
        $("#max-question").text(questions.length);
    });
    $("#no-question").text(String(index + 1))
   

    image.mapster({
        fillColor: 'CCCCCC',
        fillOpacity: 0.3,
        stroke: true,
        strokeColor: "000000",
        strokeOpacity: 0.8,
        mapKey: 'data-key',
        showToolTip: true,
        onClick: function (e) {
            if (selected.indexOf(e.key) >= 0) {
                selected.splice(selected.indexOf(e.key), 1);
            }
            else {
                selected.push(e.key);
            }
            // update text depending on area selected
            // if Asparagus selected, change the tooltip

        }
    });

    timerID = window.setInterval(function () {
        elapsedTime(false);

    }, 100);
}

function elapsedTime(bool) {
    var today = performance.now();
    var milliseconds
    if (!bool) {
        milliseconds = today - startTime;
    }
    else {
        milliseconds = today - startGameTime;
    }
    var s = Math.floor((milliseconds / 1000) % 60);
    var m = Math.floor(((milliseconds / (1000 * 60)) % 60));
    var h = Math.floor(((milliseconds / (1000 * 60 * 60)) % 24));
    //var h = today.getHours() - startTime.getHours();
    //var m = today.getMinutes() - startTime.getMinutes();
    //var s = today.getSeconds() - startTime.getSeconds();

    if (s < 10) {
        s = "0" + s;
    }
    if (s <= 0) {
        s = "00"
    }
    if (m < 10) {
        m = "0" + m;
    }
    if (m <= 0) {
        m = "00"
    }
    if (h < 10) {
        h = "0" + h;
    }
    if (h <= 0) {
        h = "00"
    }

    $("#time").text(h + ":" + m + ":" + s);

}

function restart() {
    location.reload();
}



function checkMissed(id, arr, color) {
    var num = 0;
    for (var j = 0; j < arr.length; j++) {
        if (selected.indexOf(arr[j].id) == -1) {
            num++;
            $(id).append(arr[j].description);
            image.mapster('set', false, arr[j].id, { fillColor: color });
            image.mapster('set', true, arr[j].id, { fillColor: color });
            image.mapster('set_options', {
                areas: [{
                    isSelectable: false,
                    key: arr[j].id,
                    toolTip: arr[j].src,
                    selected: true
                }]
            })
        }
    }
    return num;
}

function checkErrors(id, arr, color) {
    var number = 0;
    for (var i = 0; i < selected.length; i++) {
        for (var j = 0; j < arr.length; j++) {
            if (selected[i] == arr[j].id) {
                $(id).append(arr[j].description);
                image.mapster('set', false, arr[j].id, { fillColor: color })
                image.mapster('set', true, arr[j].id, { fillColor: color })
                image.mapster('set_options', {
                    areas: [{
                        isSelectable: false,
                        key: arr[j].id,
                        toolTip: arr[j].src,
                        selected: true
                    }]
                })
                number++;
            }
        }
    }
    return number;
}

function initiateToolTip(arr) {
    for (var j = 0; j < arr.length; j++) {
        image.mapster('set_options', {
            areas: [{
                isSelectable: false,
                key: arr[j].id,
                toolTip: arr[j].src,
                selected: true
            }]
        })
    }
}
function updateScores(finished) {

    if (!finished) {
        score.total.correct += score.now.correct;
        score.total.incorrect += score.now.incorrect;
        score.total.missed += score.now.missed;
        $('#score-correct').text(score.now.correct)
        $('#score-incorrect').text(score.now.incorrect)
        $('#score-missed').text(score.now.missed)
    }
    else {
        $('#score-correct').text(score.total.correct)
        $('#score-incorrect').text(score.total.incorrect)
        $('#score-missed').text(score.total.missed)
    }
}
function clearScores() {

    $('#score-correct').text("0")
    $('#score-incorrect').text("0")
    $('#score-missed').text("0")

}


function checkAnswers() {
    if (selected.length > 0) {
        var num1 = checkErrors("#correct", answers, "00FF00");
        var num2 = checkErrors("#incorrect", nonError, "ff0000");
        score.now.correct = num1;
        score.now.incorrect = num2;
    }
    score.now.missed = checkMissed("#missed", answers, "FFFF00");
    initiateToolTip(answers);
    $("#answers").addClass("show").removeClass("hide");
    $("#submit").addClass("hide").removeClass("show");
    $("#next").addClass("show").removeClass("hide");
    clearInterval(timerID);
    updateScores(false);
    return true;
}
function nextQuestion() {

    $(questions[index].id).addClass("hide").removeClass("show");
    //$("#answers").addClass("hide").removeClass("show");
    
    index++;
    var mapster = "#mapster_wrap_" + String(index) + " img";
    if (index < questions.length) {
        $("#no-question").text(String(index + 1))
        $(questions[index].id).addClass("show").removeClass("hide");
        answers = questions[index].error;
        nonError = questions[index].nonError;
        $("#correct").empty();
        $("#incorrect").empty();
        $("#missed").empty();
        $("#time").empty();
        $("#submit").addClass("show").removeClass("hide");
        $("#next").addClass("hide").removeClass("show");
        $(mapster).attr('src', questions[index].src);
        startTime = performance.now();
        clearScores()
        timerID = window.setInterval(function () {
            elapsedTime(false);

        }, 100);
    }
    else {
        document.getElementById('instructions').innerHTML = "<p><strong>Your total scores..</strong><p>"
        $("#answers").addClass("hide").removeClass("show");
        $("#total-questions").addClass("hide");
        $("#restart-div").addClass("show").removeClass("hide");
        elapsedTime(true);
        clearInterval(timerID);
        updateScores(true);


    }
}
