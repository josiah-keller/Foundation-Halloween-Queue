const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const uuid = require('uuid');

const accounts = require('./accounts.json');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

const QueueManager = require("./queue-manager");
const Queue = require("./queue");
// const HalloweenQueue = require('./queue.js').HalloweenQueue;

const port = process.env.PORT || 3000;

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded() );

app.use('/', express.static(__dirname+'/public'));

function start(){
    var QueueState = require('./models/QueueState.model');
    var Message = require('./models/message.model');

    var mazeQueue = new Queue(), zombieQueue = new Queue();
    var queueManager = new QueueManager({
        maze: mazeQueue,
        zombie: zombieQueue
    });

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

        socket.on('add group', (queueName, group) => { //add group
            group.id = uuid.v1();
            queueManager.queues[queueName].add(group);
            saveSendStatus('ADD');
        });

        socket.on('edit group', (queueName, group) => {
            queueManager.queues[queueName].update(group);
            saveSendStatus('EDIT');
        });

        socket.on('remove group', (queueName, index) => { // remove group
            queueManager.queues[queueName].remove(index);
            saveSendStatus('REMOVE');
        });

        socket.on('next', (queueName, shouldText) => { //notify and move groups
            queueManager.queues[queueName].next(shouldText);
            saveSendStatus('NEXT');
        });

        socket.on('back', (queueName) => {
            queueManager.queues[queueName].previous();
            saveSendStatus('BACK');
        });

        socket.on('send reminder text', (queueName) => {
            queueManager.queues[queueName].sendReminderText();
        });

        socket.on('status', (queueName, status) => {
            queueManager.queues[queueName].setStatus(status);
            saveSendStatus('STATUS ' + status);
        });

        socket.on('getState', () => { //get current status
            socket.emit('state', queueManager.getState());
        });

        socket.on('getDB', () => {            
            QueueState.find({}).sort('+time').exec( function(err, docs) {
                if (err) return console.error(err);
                console.log('getDB');
                socket.emit("database", docs);                
            });
        });

        socket.on('restore', (rowid) => {
            console.log(rowid);
             QueueState.find({}).sort('+time').skip(rowid).limit(1).exec(function(err, doc) {
                 console.log(doc);
                 loaddata(err, doc[0]);
                 saveSendStatus("RESTORE " + rowid);
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
        var state = new QueueState({ op: op, state: JSON.stringify(queueManager.getState())});
        state.save(function (err, state) {
            if (err) return console.error(err);
        });
        io.emit('state', queueManager.getState());
    }

    function saveMessage(item){
        var message = new Message({sender: item.sender, message: item.message});
        message.save(function(err, message){
            if(err) return console.error(err);
        });
    }

    function loaddata(err, data){
        if(data) {
            data = JSON.parse(data.state);
            queueManager.loadState(data);
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
    });
}

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    start(); 
});

