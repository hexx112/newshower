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

function constructgraph(showers) {
	console.log(showers)

	var ctx = document.getElementById("showerlength").getContext('2d');

	var data = [];
	for (var i in showers) {
		data.push(showers[i][1])
	}
	var labels = [];
	for (var i in showers) {
		labels.push(showers[i][0])
	}

	console.log(labels)
	console.log(data)

	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				label: 'Length of shower',
				data: data,
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)'
				],
				borderColor: [
					'rgba(255,99,132,1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)'
				],
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			}
		}
	});
}

//////////checking if account exists
var id = getParameterByName('uid')
var sessionid = guid();

socket.on('getstatsreturn', function(notyoursessionid, data) {
	if (sessionid == notyoursessionid) {
		$("#stats").html('Total score: ' + data['tot']);
		$("#stats").append('<br> Best score: ' + data['best'])

		var full = '<ul class="collection">'

		for (var i in data['achievements']) {
			var len = 52 - data['achievements'][i].length
			full += `<li class="collection-item">` + data['achievements'][i] + ' '.repeat(len) + `<i class="material-icons" onclick="avatar(${i})">add</i></li>`
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