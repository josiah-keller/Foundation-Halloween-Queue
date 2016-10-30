const TextMessages = require("./text-messages");
const apiKeys = require("./api-keys");
const twilio = require("twilio");

class Queue {
    constructor() {
        this.queue = [];
        this.nextGroup = null;
        this.currentGroup = null;
        this.done = [];
        this.status = "good";
        this.queueManager = null;
        
        this.client = new twilio.RestClient(apiKeys.sid, apiKeys.authToken);
    }
    next(shouldText) {
        if (this.currentGroup) {
            this.done.push(this.currentGroup);
            // Unlink placeholder
            if (this.currentGroup.next) {
                this.queueManager.queues[this.currentGroup.next].find(this.currentGroup.id).pending = false;
                this.currentGroup.next = null;
            }
        }
        if (this.nextGroup) {
            this.currentGroup = this.nextGroup;
        } else {
            this.currentGroup = null;
        }
        if (this.queue.length > 0) {
            // Leapfrog over placeholders
            // Causes placeholders to collect at the top of the queue until they're ready
            let firstNotPendingIndex = this.queue.findIndex(g => !g.pending);
            if (firstNotPendingIndex === -1) {
                this.nextGroup = null;
            } else {
                this.nextGroup = (this.queue.splice(firstNotPendingIndex, 1))[0] || null;
            }
        } else {
            this.nextGroup = null;
        }
        if (shouldText) {
            // Text next group
            if (this.nextGroup) this.sendText(this.nextGroup, TextMessages.MESSAGE_NEXT);
            // Text second-to-next group that isn't pending
            var nextNotPending = this.queue.find(g => !g.pending);
            if (nextNotPending) this.sendText(nextNotPending, TextMessages.MESSAGE_ALMOST_NEXT);
        }
    }
    previous() {
        if (this.nextGroup) {
            // Don't leapfrog back over
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
        if (index < 0) return;
        this.queue.splice(index, 1);
    }
    removeById(id) {
        this.remove(this.queue.findIndex(g => g.id === id));
    }
    update(group) {
        if (this.currentGroup && this.currentGroup.id === group.id) return this.currentGroup = group;
        if (this.nextGroup && this.nextGroup.id === group.id) return this.nextGroup = group;

        let index = this.queue.findIndex(g => g.id === group.id);
        this.queue[index] = group;
    }
    find(id) {
        if (this.currentGroup && this.currentGroup.id === id) return this.currentGroup;
        if (this.nextGroup && this.nextGroup.id === id) return this.nextGroup;

        return this.queue.find(g => g.id === id);
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
        let message = messageTemplate;
        message = message.replace(new RegExp("{name}", "g"), group.name);
        message = message.replace(new RegExp("{queueName}", "g"), group.queueName);

        let phoneNumber = "1" + group.phoneNumber.replace(new RegExp("-", "g"), "");
        this.client.messages.create({
            body: message,
            to: phoneNumber,
            from: apiKeys.fromNumber
        }, (err, message) => {
            if (err) {
                console.error(err.message);
            }
        });
    }
    remind() {
        this.sendText(this.nextGroup, TextMessages.MESSAGE_REMINDER);
    }
}

module.exports = Queue;