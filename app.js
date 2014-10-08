var express = require('express');
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/', express.static(__dirname+'/public'));

io.on('connection', function(socket){
    console.log("a user connected");
    socket.emit('connected', { hello: "world"});
    socket.on('disconnect', function(){
	console.log('user disconnected');
    });

    socket.on('add group', function(data){ //new group entered

    });

    socket.on('remove group', function(data){// group removed
	
    });

    socket.on('next', function(){//notify and move groups

    });

    socket.on('getData', function(){//get current status

    });
});

http.listen(3000, function(){
    console.log('Listening on port %d', http.address().port);
});
