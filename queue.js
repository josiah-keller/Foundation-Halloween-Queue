var twilio = require('twilio');

var accountSid = 'ACf72e0a36e3a78b1a4301c58a3a62faa3';
var authToken = "c898fc493f1744a89f3bfb9f9f204536";
var client = twilio(accountSid, authToken);

var HalloweenQueue = function(io){
    this.queue = [];
    this.nextGroup = null;
    this.currentGroup = null;
    this.done = [];
    this.mazeStatus = 'good';
    this.errorCallback = function (err){
        io.emit("error", err);
    };
}

HalloweenQueue.prototype.next = function(texting){
    if(this.currentGroup != null){
       this.done.push(this.currentGroup);
    }
    if(this.nextGroup != null){
        this.currentGroup = this.nextGroup;
    }else{
        this.currentGroup = null;
    }
    if(this.queue.length != 0){
        this.nextGroup = this.queue.shift();
    }else{
        this.nextGroup = null;
    }
    if(texting){
        this.sendText(this.nextGroup);
    }
}

HalloweenQueue.prototype.back = function(){
    if(this.nextGroup !=null){
        this.queue.unshift(this.nextGroup);
    }
    if(this.currentGroup != null){
        this.nextGroup = this.currentGroup;
    }else{
        this.nextGroup = null;
    }
    if(this.done[this.done.length-1] != null){
        this.currentGroup = this.done.pop();
    }else{
        this.currentGroup = null;
    }
}

HalloweenQueue.prototype.sendReminderText = function(){
    this.sendText(this.nextGroup);
}

HalloweenQueue.prototype.add = function(group){
    this.queue.push(group);
}

HalloweenQueue.prototype.remove = function(index){
    this.queue.splice(index, 1);
}

HalloweenQueue.prototype.setMazeStatus = function(mazeStatus){
    this.mazeStatus = mazeStatus;
}

HalloweenQueue.prototype.getState = function(){
    var state = {};
    state.currentGroup = this.currentGroup;
    state.nextGroup = this.nextGroup;
    state.queue = this.queue;
    state.done = this.done;
    state.mazeStatus = this.mazeStatus;
    return state;
}

HalloweenQueue.prototype.loadState = function(state){
    this.currentGroup = state.currentGroup;
    this.nextGroup = state.nextGroup;
    this.queue = state.queue;
    this.done = state.done;
    this.mazeStatus = state.mazeStatus;
}

HalloweenQueue.prototype.sendText = function(group){
    var phoneNumber = "+1" + group.phoneNumber.split("-").join('');
    var errorCallback = this.errorCallback;
    client.messages.create({
        body: "Foundation - Your group is next in the Haunted Maze! Please come to the entrance!",
        to: "+16306975879",
        from: "+17085723531"
    }, function(err, message) {
        if(err){
            errorCallback(err);
        }
    });
}

exports.HalloweenQueue = HalloweenQueue;