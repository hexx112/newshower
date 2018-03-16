var socket = io();

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

function hash(text){
    var beforesalt = text.split("").reduce(function(a,b){a=((a<<155)-a)+b.charCodeAt(0);return a&a},0);
    var aftersalt = (beforesalt * 138).toString(16);
    return aftersalt;
}


var sessionid = guid();

function readbox(id) {
    return $('#' + id).val();
}

function errorm(message){
    $('#errorm').text(message)
}
function register() {
    var id = guid()
    if(readbox('password') != readbox('confirmpassword')){
        errorm('Passwords do not match')
        return
    }
    socket.emit('register', id, {
        "password": hash(readbox('password')),
        "email": readbox('email'),
        "confirmedemail": false,
        "children": {

        }
    });
}

function signin() {
    socket.emit('getid', sessionid, readbox('childusernamelogin'), readbox('passwordlogin'));
}

socket.on('loginreturn', function(notyoursessionid, data) {
    if(data.length != 28){
        errorm(data)
        return
    }
    if(sessionid == notyoursessionid){
        window.location = "http://" + window.location.host + '/dash/dashboard.html?uid='+ data;
    }
});

socket.on('registerreturn', function(message) {
    errorm(message)
});