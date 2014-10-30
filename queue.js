var nexmo = require('easynexmo');

nexmo.initialize('ea0e8d24','7ee09e56','https',true);

var HalloweenQueue = function(io){
    this.queue = [];
    this.nextGroup = null;
    this.currentGroup = null;
    this.done = [];
    this.mazeStatus = 'good';
    this.errorCallback = function (err, message){
        if(err){
            console.log(err);
            io.emit("error", err);
        } 
        else{
            console.log(message);
        }
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
    if(texting && this.nextGroup != null){
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

HalloweenQueue.prototype.edit = function(group){
    for(var i = 0; i<this.queue.length; i++){
        if(this.queue[i].id == group.id){
            this.queue[i] = group;
        }
    }
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
    var phoneNumber = "1" + group.phoneNumber.split("-").join('');
    var errorCallback = this.errorCallback;
    nexmo.sendTextMessage("12105190253",phoneNumber,'Your group is next in the Haunted Maze! Please come to the entrance!',null,this.errorCallback);
}

exports.HalloweenQueue = HalloweenQueue;