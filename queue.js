var twilio = require('twilio');

var accountSid = 'ACf72e0a36e3a78b1a4301c58a3a62faa3';
var authToken = "c898fc493f1744a89f3bfb9f9f204536";
var client = twilio(accountSid, authToken);

var HalloweenQueue = function(){
    this.queue = [];
    this.nextGroup = null;
    this.currentGroup = null;
    this.done = [];
}

HalloweenQueue.prototype.next = function(){
    if(this.currentGroup != null){
	this.done.push(this.currentGroup);
    }
    if(this.nextGroup != null){
	this.currentGroup = this.nextGroup;
    }
    if(this.queue.length != 0){
	this.nextGroup = this.queue.shift();
    }
    this.sendText(this.nextGroup);
//    this.sendText(this.queue[0]);
}

HalloweenQueue.prototype.add = function(group){
    this.queue.push(group);
}

HalloweenQueue.prototype.remove = function(index){
    this.queue.splice(index, 1);
}

HalloweenQueue.prototype.getState = function(){
    var state = {};
    state.currentGroup = this.currentGroup;
    state.nextGroup = this.nextGroup;
    state.queue = this.queue;
    state.done = this.done;
    return state;
}

HalloweenQueue.prototype.loadState = function(state){
    this.currentGroup = state.currentGroup;
    this.nextGroup = state.nextGroup;
    this.queue = state.queue;
    this.done = state.done;
}

HalloweenQueue.prototype.sendText = function(group){
    console.log(group)
    client.messages.create({
        body: "Your group is next in the Haunted Maze!",
        to: "+16306975879",
        from: "+17085723531"
    }, function(err, message) {
        if(err){
            console.log(err);
        }else{
            console.log(message.sid);
        }
    });
}

exports.HalloweenQueue = HalloweenQueue;