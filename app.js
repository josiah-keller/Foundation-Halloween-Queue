const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const uuid = require('uuid');

const accounts = require('./accounts.json');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

const HalloweenQueue = require('./queue.js').HalloweenQueue;

const port = process.env.PORT || 3000;

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );

app.use('/', express.static(__dirname+'/public'));

function start(){
    
    var QueueState = require('./models/QueueState.model');
    var Message = require('./models/message.model');

    var queue = new HalloweenQueue(io);
    var chat = [];

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

    app.get('/download', function(req,res){
        //var file = __dirname + '/database.db';
        //res.download(file);
    });

    io.on('connection', function(socket){
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

        socket.on('add group', function(group){ //add group
            group.id = uuid.v1();
            queue.add(group);
            saveSendStatus('ADD');
        });

        socket.on('edit group', function(group){
            queue.edit(group);
            saveSendStatus('EDIT');
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
            saveSendStatus('MAZE '+state);
        })

        socket.on('getState', function(){//get current status
            socket.emit('state', queue.getState());
        });

        socket.on('getDB', function(){            
            QueueState.find({}).sort('+time').exec( function(err, docs) {
                if (err) return console.error(err);
                console.log('getDB');
                socket.emit("database", docs);                
            });
        });

        socket.on('restore', function(rowid){
            console.log(rowid);
             QueueState.find({}).sort('+time').skip(rowid).limit(1).exec(function(err, doc) {
                 console.log(doc);
                 loaddata(err, doc[0]);
                 saveSendStatus("RESTORE "+rowid);
             });
        });

        socket.on('getChat', function(){
            socket.emit('chatUpdate', chat);
        });

        socket.on('newChat', function(item){
            saveMessage(item);
            chat.push(item);
            io.emit('chatUpdate', chat);
        })
    });

    http.listen(port, function(){
        console.log('Listening on port %d', http.address().port);
    });

    function saveSendStatus(op){
        var state = new QueueState({ op: op, state: JSON.stringify(queue.getState())});
        state.save(function (err, state) {
            if (err) return console.error(err);
        });
        io.emit('state', queue.getState());
    }

    function saveMessage(item){
        var message = new Message({sender: item.sender, message: item.message});
        message.save(function(err, message){
            if(err) return console.error(err);
        });
    }

    function loaddata(err, data){
        if(data) {
            data = JSON.parse(data.state)
            queue.loadState(data);
        }
    }

    function loadchat(docs){
        chat = docs;
    }

    function err(data){
        console.log(data);
    }
    
    QueueState.find({}).sort('-time').limit(1).exec(function(err, doc) {
        if(err) return console.error(err);
        loaddata(err, doc[0]);        
    });
    
    
    Message.find({}).sort('-time').exec(function (err, docs) {
       if(err) return console.error(err);
       loadchat(docs);        
    })

}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    start(); 
});

