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

function send(num){
  socket.emit('endshower', id, num);
}
//////////

var num = 500;
var orgnum = num;
var intervalID;

window.onload = function() {
  $("#count").html(num);
};

function start() {
  intervalID = window.setInterval(showerticker, 1000);
  $("#start").addClass("disabled");
  $("#end").removeClass("disabled");

  num = orgnum
  $("#count").html(num);
}

function end() {
  clearInterval(intervalID)
  $("#end").addClass("disabled");
  $("#start").removeClass("disabled");

  $( "#count" ).prepend( "You got: " );

  send(num)
}

function showerticker() {
  num -= 1

  $("#count").html(num);
}
