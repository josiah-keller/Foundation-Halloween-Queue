var express = require('express');
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();

var HalloweenQueue = require('./queue.js').HalloweenQueue;

function start(){
    
    var file = "database.db";
    var exists = fs.existsSync(file);
    
    var db = new sqlite3.Database(file);
    db.serialize(function(){
	if(!exists){
	    db.run("CREATE TABLE queue (state TEXT, time DATETIME)");
	}
    });
    
    var queue = new HalloweenQueue();

    app.use('/', express.static(__dirname+'/public'));

    io.on('connection', function(socket){
	console.log("a user connected");
	socket.emit('connected', { hello: "world"});
	socket.on('disconnect', function(){
	    console.log('user disconnected');
	});

	socket.on('add group', function(group){ //add group
	    queue.add(group);
	    socket.emit('state', queue.getState());
	});

	socket.on('remove group', function(index){// remove group
	    queue.remove(index);
	    socket.emit('state', queue.getState());
	});

	socket.on('next', function(){//notify and move groups
	    queue.next();
	    socket.emit('state', queue.getState());
	});

	socket.on('getData', function(){//get current status

	});
    });

    http.listen(3000, function(){
	console.log('Listening on port %d', http.address().port);
    });

    main();
}

function main(){
    
}
 
start();
