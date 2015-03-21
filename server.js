var http_port = 4242;

var express = require('express');
var app  = express();
var http = require('http').Server(app);
var io   = require('socket.io')(http);
var fs   = require('fs');

var usernames = {};
var rooms = [];

rooms['wait'] = {};

app.use('/static', express.static(__dirname + '/public'));

function sendPage(page, res) {
    fs.readFile(page, function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': data.length});
        res.write(data);
        res.end();
    });
}

app.get('/', function(req, res) {
    console.log('[http] index page requested');
    sendPage('html/index.html', res);
});

app.get('/game', function(req, res) {
    console.log('[http] game page requested');
    sendPage('html/game.html', res);
});

/*** DEVELOPPEMENT ***/
app.get('/socket', function(req, res) {
    console.log('[http] test page requested');
    sendPage('html/socket.html', res);
});
/*********************/

io.on('connection', function(socket) {
    console.log('[ io ] new user connected');

    socket.on('search-game', function(data) {
        // TODO: check if username is already used

        socket.username = data.username;
        socket.room = 'wait';
        socket.join('wait');

        usernames[data.username] = data.username;
        rooms['wait'][data.username] = socket;

        console.log('[ io ] '+data.username+' join waiting room');
        // TODO: search enemy
        //socket.emit('search-game-success', { enemy: 'nobody' });
        //socket.emit('search-game-failed', { error: '...' });

        for(var user in rooms['wait']) {
            console.log('Username: ' + user);
        }
    });

    socket.on('disconnect', function() {
        if (typeof socket.username !== 'undefined')
        {
            console.log(socket.username+' leave game');
            socket.leave(socket.room);
            delete rooms[socket.room][socket.username];
        }
    });
});

http.listen(http_port, function() {
    console.log('[http] battleships server running at http://127.0.0.1:' + http_port);
});
