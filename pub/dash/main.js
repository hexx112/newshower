var socket = io();

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

function readbox(id) {
    return $('#' + id).val();
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

//////////checking if account exists
var id = getParameterByName('uid')
var sessionid = guid();

socket.on('root', function(notyoursessionid) {
    if (sessionid == notyoursessionid) {
        window.location = "http://" + window.location.host
    }
});

socket.on('getstatsreturn', function(notyoursessionid, data) {
    if (sessionid == notyoursessionid) {
        $("#stats").html('Total score: ' + data['tot'] + '<br> Best score: ' + data['best']);
    }
});

function send(num) {
    socket.emit('endshower', id, num);
}

function getstats() {
    socket.emit('getstats', sessionid, id)
}

function gotostats() {
    window.location.href = 'stats.html?uid=' + id
}

//////////
var speed = 1000
var num = 500;
var orgnum = num;
var intervalID;

window.onload = function() {
    $("#count").html(num);
    getstats()
};

function start() {
    intervalID = window.setInterval(showerticker, speed);
    $("#start").addClass("disabled");
    $("#end").removeClass("disabled");

    num = orgnum
    $("#count").html(num);
}

function end() {
    clearInterval(intervalID)
    $("#end").addClass("disabled");
    $("#start").removeClass("disabled");

    $("#count").prepend("You got: ");

    send(num)
    getstats()
}

function makergb(r, g, b) {
    console.log(r, g, b);
    $('.fade').css("background", "rgb(" + r + ", " + g + ", " + b + ")");
}

function showerticker() {
    num -= 1
    makergb(orgnum / 2 - num / 2, num / 2, 0)
    $("#count").html(num);
}

//hardware socket fires
socket.on('hardstart', function(notyourid) {
    if (id == notyourid) {
        $('#start').addClass('disabled')
        intervalID = window.setInterval(showerticker, speed);
        num = orgnum
        $("#count").html(num);
    }
});

socket.on('hardend', function(notyourid) {
    if (id == notyourid) {
        $('#start').removeClass('disabled')
        clearInterval(intervalID)
        getstats()
    }
});