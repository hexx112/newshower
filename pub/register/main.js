var socket = io();




var sessionid = guid();

function readbox(id) {
	return $('#' + id).val();
}

function errorm(message) {
	$('#errorm').text(message)
}

function date() {
	var d = new Date();
	return d.getFullYear() + '/' + String(d.getMonth() + 1) + '/' + d.getDate()
}

function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase());
}

function register() {
	var id = guid()
	if (validateEmail(readbox('email')) == false) {
		errorm('email is invalid')
		return
	}
	if (readbox('password') != readbox('confirmpassword')) {
		errorm('Passwords do not match')
		return
	}
	socket.emit('register', id, {
		"password": hash(readbox('password')),
		"email": readbox('email'),
		"confirmedemail": false,
		"tot": 0,
		"best": 0,
		"achievements": [
			date() + ': Created account'
		],
		"showers": [

		]
	});
}

socket.on('registerreturn', function(message) {
	errorm(message)
	$('#buttonchange').append('<a class="btn" href ="../login">log in</a>').show();
});