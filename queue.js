const TextMessages = require("./text-messages");

class Queue {
    constructor() {
        this.queue = [];
        this.nextGroup = null;
        this.currentGroup = null;
        this.done = [];
        this.status = "good";
    }
    next(shouldText) {
        if (this.currentGroup) {
            this.done.push(this.currentGroup);
        }
        if (this.nextGroup) {
            this.currentGroup = this.nextGroup;
        } else {
            this.currentGroup = null;
        }
        if (this.queue.length > 0) {
            this.nextGroup = this.queue.shift();
        } else {
            this.nextGroup = null;
        }
        if (shouldText) {
            this.sendText(this.nextGroup, TextMessages.MESSAGE_NEXT);
            this.sendText(this.queue[0], TextMessages.MESSAGE_ALMOST_NEXT);
        }
    }
    previous() {
        if (this.nextGroup) {
            this.queue.unshift(this.nextGroup);
        }
        if (this.currentGroup) {
            this.nextGroup = this.currentGroup;
        } else {
            this.nextGroup = null;
        }
        if (this.done[this.done.length - 1]) {
            this.currentGroup = this.done.pop();
        } else {
            this.currentGroup = null;
        }
    }
    add(group) {
        this.queue.push(group);
    }
    remove(index) {
        this.queue.splice(index, 1);
    }
    update(group) {
        if (this.currentGroup.id === group.id) return this.currentGroup = group;
        if (this.nextGroup.id === group.id) return this.nextGroup = group;

        let index = this.queue.findIndex(g => g.id === group.id);
        this.queue[index] = group;
    }
    setStatus(status) {
        this.status = status;
    }
    getState() {
        let state = {};
        state.currentGroup = this.currentGroup;
        state.nextGroup = this.nextGroup;
        state.queue = this.queue;
        state.done = this.done;
        state.status = this.status;
        return state;
    }
    loadState(state) {
        this.currentGroup = state.currentGroup;
        this.nextGroup = state.nextGroup;
        this.queue = state.queue;
        this.done = state.done;
        this.status = state.status;
    }

    sendText(group, messageTemplate) {

    }
    sendReminderText(group, messageTemplate) {
        
    }
}

module.exports = Queue;