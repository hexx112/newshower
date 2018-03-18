var socket = io();

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + s4() + s4() + s4() + s4() + s4();
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

socket.on('getstatsreturn', function(notyoursessionid, data){
  if (sessionid == notyoursessionid){
    $("#stats").html('Total coins: ' + data['tot']);
    $("#stats").append('<br> Best score: ' + data['best'])
    $("#stats").append('<ul>')
    for(var i in data['achievements']){
        $("#stats").append('<li>' + data['achievements'][i] + '</li>')
    }
    $("#stats").append('</ul>')
  }
});

function send(num){
  socket.emit('endshower', id, num);
}

function getstats(){
  socket.emit('getstats', sessionid, id)
}

//////////

window.onload = function() {
  getstats()
};

getstats()
