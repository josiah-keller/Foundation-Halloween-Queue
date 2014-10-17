var express = require('express');
var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();
var accounts = require('./accounts.json');

var HalloweenQueue = require('./queue.js').HalloweenQueue;

var port = process.env.PORT || 3000;

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );

app.use('/', express.static(__dirname+'/public'));

function start(){

    var queue = new HalloweenQueue();

    var file = "database.db";
    var exists = fs.existsSync(file);
    var db = new sqlite3.Database(file);
    db.serialize(function(){
        if(!exists){
            db.run("CREATE TABLE queue ('op' TEXT, 'state' TEXT, 'time' DATETIME)");
        }else{
            db.each("SELECT state FROM queue WHERE rowid = (SELECT MAX(rowid) FROM queue)", loaddata);
        }
    });

    app.post('/login', function(req,res){
        var username = req.body.username;
        var password = req.body.password;
        for(var i = 0; i < accounts.length; i++){
            var user = accounts[i];
            if(username == user.username && password == user.password){
                res.send({'authenticated': true, 'permissions':user.permissions});
                return;
            }
        }
        res.send({'authenticated': false});
    });

    io.on('connection', function(socket){
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

        socket.on('add group', function(group){ //add group
            queue.add(group);
            saveSendStatus('ADD');
        });

        socket.on('remove group', function(index){// remove group
            queue.remove(index);
            saveSendStatus('REMOVE');
        });

        socket.on('next', function(texting){//notify and move groups
            queue.next(texting);
            saveSendStatus('NEXT');
        });

        socket.on('back', function(){
            queue.back();
            saveSendStatus('BACK');
        });

        socket.on('send reminder text', function(){
            queue.sendReminderText();
        });

        socket.on('mazeStatus', function(state){
            queue.setMazeStatus(state);
            saveSendStatus('MAZE STATUS');
        })

        socket.on('getState', function(){//get current status
            socket.emit('state', queue.getState());
        });

        socket.on('getDB', function(){
            var rows = [];
            db.each("SELECT rowid, op, state, time FROM queue", function(err,row){
                console.log(row);
                rows.push(row);
            }, function(err, numRows){
                socket.emit("database", rows);
            });
        });
    });

    http.listen(port, function(){
        console.log('Listening on port %d', http.address().port);
    });

    function saveSendStatus(op){
        db.serialize(function (){
            db.run("INSERT INTO queue (op, state, time) VALUES ( ?, ? , datetime())", [op, JSON.stringify(queue.getState())], err);
        });
        io.emit('state', queue.getState());
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
