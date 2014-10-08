var express = require('express');
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();

var HalloweenQueue = require('./queue.js').HalloweenQueue;

var port = process.env.PORT || 3000;

function start(){
    
    var queue = new HalloweenQueue();

    var file = "database.db";
    var exists = fs.existsSync(file);
    console.log(exists);
    var db = new sqlite3.Database(file);
    db.serialize(function(){
        if(!exists){
            db.run("CREATE TABLE queue ('state' TEXT, 'time' DATETIME)");
        }else{
            db.each("SELECT state FROM queue WHERE rowid = (SELECT MAX(rowid) FROM queue)", loaddata);
        }
    });

    app.use('/', express.static(__dirname+'/public'));

    io.on('connection', function(socket){
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

        socket.on('add group', function(group){ //add group
            queue.add(group);
            saveSendStatus(socket);
        });

        socket.on('remove group', function(index){// remove group
            queue.remove(index);
            saveSendStatus(socket);
        });

        socket.on('next', function(){//notify and move groups
            queue.next();
            saveSendStatus(socket);
        });

        socket.on('getState', function(){//get current status
            socket.emit('state', queue.getState());
        });
    });

    http.listen(port, function(){
        console.log('Listening on port %d', http.address().port);
    });

    function saveSendStatus(socket){
        db.serialize(function (){
            db.run("INSERT INTO queue (state, time) VALUES ( ? , datetime())",JSON.stringify(queue.getState()), err);
        });
        socket.emit('state', queue.getState());
    }

    function loaddata(err, data){
        data = JSON.parse(data.state)
        queue.loadState(data);
    }

    function err(data){
        console.log(data);
    }

}
 
start();
