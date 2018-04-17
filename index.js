// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var total = 0;
var nodemailer = require('nodemailer');
var fs = require('fs')

var adminkey = 'bubbles'

server.listen(port, function() {
	console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'pub/')));
app.get('/admin/download', function(req, res) {
	if (req.query['pass'] == adminkey) {
		var file = __dirname + '\\accounts.json';
		res.download(file); // Set disposition and send it.
	}
});
app.get('*', function(req, res) {
	res.sendFile('./pub/error/404.html', {
		root: __dirname
	})
});


function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var accounts = {};

// sync db write
function syncdbwrite() {
	var logger = fs.createWriteStream('accounts.json', {
		flags: 'w+'
	})
	var jsonaccounts = JSON.stringify(accounts);
	logger.write(jsonaccounts);
}

function bootup() {
	try {
		var accounts = JSON.parse(fs.readFileSync('accounts.json', 'utf8'));
		console.log('read from file');
		return accounts;
	} catch (err) {
		var accounts = {}
		console.log('created thing');
		return accounts;
	}
}
var accounts = bootup()

/////////////////////////
function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

function hash(text) {
	var beforesalt = text.split("").reduce(function(a, b) {
		a = ((a << 155) - a) + b.charCodeAt(0);
		return a & a
	}, 0);
	var aftersalt = (beforesalt * 138).toString(16);
	return aftersalt;
}

function confirmmail(adress, childusername) {
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'cronjab@gmail.com',
			pass: "cronjabber"
		}
	});

	var mailOptions = {
		from: 'cronjab@gmail.com',
		to: adress,
		subject: "Confirm your account creation",
		text: 'http://localhost:3000/ext/confirm.html?id=' + childusername,
		html: '<a href="' + 'http://localhost:3000/ext/confirm.html?id=' + childusername + '">Confirm your account</a>'
	};

	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}

function cap(text) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

function date() {
	var d = new Date();
	return d.getFullYear() + '/' + String(d.getMonth() + 1) + '/' + d.getDate()
}

function sortFunction(a, b) {
	if (a[0] === b[0]) {
		return 0;
	} else {
		return (a[0] < b[0]) ? -1 : 1;
	}
}

function regshower(id, num) {
	accounts[id]['tot'] += num
	console.log(id + ' got ' + num + '. Now at ' + accounts[id]['tot'])

	var newachievements = []
	for (var i in accounts[id]['achievements']) {
		var parse = accounts[id]['achievements'][i].split(' ');
		delete parse[0]
		newachievements.push(parse.join())
	}

	// achievements
	if (num < 0) {
		var str = date() + ': Water waster!'
		var parse = (str).split(' ');
		delete parse[0]
		if (newachievements.includes(parse.join()) == false) {
			accounts[id]['achievements'].push(str)
		}
	}

	if (num > 200) {
		var str = date() + ': Super quick shower'
		var parse = (str).split(' ');
		delete parse[0]
		if (newachievements.includes(parse.join()) == false) {
			accounts[id]['achievements'].push(str)
		}
	}

	if (num == 0) {
		var str = date() + ': Average shower';
		var parse = (str).split(' ');
		delete parse[0]
		if (newachievements.includes(parse.join()) == false) {
			accounts[id]['achievements'].push(str)
		}
	}

	if (num == 123) {
		var str = date() + ': Rarity badge';
		var parse = (str).split(' ');
		delete parse[0]
		if (newachievements.includes(parse.join()) == false) {
			accounts[id]['achievements'].push(str)
		}
	}

	//ranks
	var ranks = [
		['Apprentice', 1000],
		['Professional', 5000],
		['Master', 10000]
	]
	for (var i in ranks) {
		if (accounts[id]['tot'] > ranks[i][1]) {
			var str = date() + ': ' + ranks[i][0] + ' saver';
			var parse = (str).split(' ');
			delete parse[0]
			if (newachievements.includes(parse.join()) == false) {
				accounts[id]['achievements'].push(str)
			}
		}
	}

	///////////////

	// append to graph
	var d = new Date()
	accounts[id]['showers'].push([date(), num])
	console.log('appended ' + [date(), num] + ' to ' + id + '\'s account')

	if (accounts[id]['best'] < num) {
		accounts[id]['best'] = num;
	}

	console.log(accounts[id]['email'] + ' just ended their shower')
}


function doshell(command) {
	const {
		exec
	} = require('child_process');
	exec(String(command), (err, stdout, stderr) => {

		// the *entire* stdout and stderr (buffered)
		io.emit('returnshell', stdout + stderr)
	});
}

io.on('connection', function(socket) {

	socket.on('register', function(childusername, profile) {
		var uniquemail = true;
		for (var i in accounts) {
			if (accounts[i]['email'] == profile['email']) {
				io.emit('registerreturn', 'Please use a unique email adress.', false)
				var uniquemail = false;
			}
		}
		if (uniquemail == true) {
			accounts[childusername] = profile
			console.log(accounts)
			confirmmail(accounts[childusername]['email'], childusername)
			io.emit('registerreturn', 'registered successfully', true)
		}
		syncdbwrite()
	});

	socket.on('confirmemail', function(data) {
		accounts[data]['confirmedemail'] = true;
		console.log('confirmed ' + data)
		syncdbwrite()
	});

	socket.on('endshower', function(id, num) {
		regshower(id, num)
		syncdbwrite()
	});

	socket.on('getstats', function(sessionid, id) {
		io.emit('getstatsreturn', sessionid, accounts[id])
	});

	socket.on('getid', function(sessionid, username, password) {
		console.log('logging in ' + username.replace(/<{1}[^<>]{1,}>{1}/g, ""))
		for (var i in accounts) {
			if (accounts[i]['email'].replace(/<{1}[^<>]{1,}>{1}/g, "") == username.replace(/<{1}[^<>]{1,}>{1}/g, "")) {
				if (accounts[i]['password'] == hash(password)) {
					io.emit('loginreturn', sessionid, i)
					return
				}
			}
		}
		io.emit('loginreturn', sessionid, 'login failed')
	});

	socket.on('admin', function() {
		io.emit('adminreturn', accounts);
	});

	socket.on('getboard', function(sessionid) {
		var parseaccounts = []
		for (var i in accounts) {
			if (accounts[i]['showers'].length == 0) {
				continue
			}
			parseaccounts.push([accounts[i]['tot'] / (accounts[i]['showers'].length), accounts[i]['email']])
		}
		parseaccounts = parseaccounts.sort(sortFunction).reverse().slice(0, 10)
		io.emit('returnboard', parseaccounts, sessionid);
	});

	socket.on('doshell', function(command) {
		if (command != '') {
			doshell(command)
		}
	});

	socket.on('avatar', function(id, num) {
		accounts[id]['email'] = accounts[id]['email'].replace(/<{1}[^<>]{1,}>{1}/g, "") + `<img src='../badge/${num}.jpg'></img>`
	});

});


app.post('/hard/start', function(req, res) {
	var id = getParameterByName('id', req.originalUrl)
	for (var i in accounts) {
		if (accounts[i]['email'] == id) {
			id = i;
		}
	}
	console.log(id + ' started their shower remotely');
	io.emit('hardstart', id);
	res.send('all good')
});

app.post('/hard/end', function(req, res) {
	var num = getParameterByName('num', req.originalUrl)
	var id = getParameterByName('id', req.originalUrl)
	for (var i in accounts) {
		if (accounts[i]['email'] == id) {
			id = i;
		}
	}
	console.log(num + ' is ' + id);
	io.emit('hardend', id);
	regshower(id, parseInt(num))
	syncdbwrite()
	res.send('all good')
});