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

exports.HalloweenQueue = HalloweenQueue;
