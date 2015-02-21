var http_port = 81;
var io_port   = 82;

var express = require('express');
var fs      = require('fs');
var io      = require('socket.io')(io_port);

var app = express();

app.use('/static', express.static(__dirname + '/public'));

app.get('/game', function(req, res) {
    fs.readFile('html/game.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': data.length});
        res.write(data);
        res.end();
    })
});

app.listen(http_port);

console.log('Battleships server running at http://127.0.0.1:' + http_port);
