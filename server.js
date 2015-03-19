var http_port = 4242;

var express = require('express');
var app  = express();
var http = require('http').Server(app);
var io   = require('socket.io')(http);
var fs   = require('fs');

app.use('/static', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    fs.readFile('html/index.html', function(err, data) {
        console.log('[http] index page requested');
        res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': data.length});
        res.write(data);
        res.end();
    });
});

app.get('/game', function(req, res) {
    fs.readFile('html/game.html', function(err, data) {
        console.log('[http] game page requested');
        res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': data.length});
        res.write(data);
        res.end();
    });
});

io.on('connection', function(socket) {
    console.log('[ io ] new user connected');
});

http.listen(http_port, function() {
    console.log('[http] battleships server running at http://127.0.0.1:' + http_port);
});
