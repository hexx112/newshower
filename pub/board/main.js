function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

function createTable(tableData) {
    var table = document.createElement('table');
    var tableHead = document.createElement('thead');
    tableHead.innerHTML = "<tr><th>Average Score</th><th>email</th></tr>";
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

    table.appendChild(tableHead);
    table.appendChild(tableBody);
    document.getElementById("board").appendChild(table);
}

var socket = io();
var sessionid = guid()
var called = false;

function serveboard() {
    socket.emit('getboard', sessionid);
}

serveboard()

socket.on('returnboard', function(board, notyoursessionid) {
    if (called == false) {
        console.log(board)
        createTable(board)
        called = true
    }
});