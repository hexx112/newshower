var socket = io();

//////////checking if account exists
var id = getParameterByName('uid')
var sessionid = guid();

socket.on('getstatsreturn', function(notyoursessionid, data) {
	if (sessionid == notyoursessionid) {
		$("#stats").html('Total score: ' + data['tot']);
		$("#stats").append('<br> Best score: ' + data['best'])

		var full = '<ul class="collection">'

		for (var i in data['achievements']) {
			var len = 30 - data['achievements'][i].length;
			var sli = data['achievements'][i].split(':')[1].slice(0, 4).toLowerCase().replace(" ", "")
			console.log(sli);
			if (sli != 'cre') {
				full += `<li class="collection-item">` + data['achievements'][i] + ' '.repeat(len) + `<i class="material-icons" onclick="avatar('${sli}')">add</i>` + `<img src='../badge/` + sli.replace(' ', '') + `.png'></img>` + '</li>'
			} else {
				full += `<li class="collection-item">` + data['achievements'][i] + ' '.repeat(len)
			}
		}


		full += '</ul>'

		var showers = data['showers'].slice(1).slice(-10)
		constructgraph(showers)

		$("#stats").append(full)
	}
});

function getstats() {
	socket.emit('getstats', sessionid, id)
}

window.onload = function() {
	getstats()
};

getstats()

function avatar(num) {
	socket.emit('avatar', id, num)
}