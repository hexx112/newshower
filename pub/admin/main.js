var socket = io();

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

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

function createTable(tableData) {
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');

    tableData.forEach(function(rowData) {
        var row = document.createElement('tr');

        rowData.forEach(function(cellData) {
            var cell = document.createElement('td');
            cell.appendChild(document.createTextNode(cellData));
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });

    table.appendChild(tableBody);
    $('.tab').append(table);
}

socket.on('adminreturn', function(data) {

    var table = [
        ['email', 'best', 'total', 'account creation', 'id', 'hashed pass']
    ]

    for (var i in data) {
        //$('body').append(data[i]['email'] + ' # ' + data[i]['best'] + ' # ' + data[i]['tot'] + ' # ' + data[i]['achievements'][0] + '<br>')
        table.push([data[i]['email'],
            data[i]['best'],
            data[i]['tot'],
            data[i]['achievements'][0],
            i,
            data[i]['password']
        ])
    }

    createTable(table.slice(1).slice(-5));
});

if (getParameterByName('pass') != 'bubbles') {
    window.location.href = '../error/403.html'
} else {
    var sessionid = guid();
    socket.emit('admin');
}

//shell
function send() {
    socket.emit('doshell', $('#shell').val());
}
socket.on('returnshell', function(back) {
    if (back == '') {
        $('.out').text('No STDOUT')
    } else {
        $('.out').text(back)
    }
});

function checkkey(event) {
    if (event.which == 13) {
        send()
    }
};