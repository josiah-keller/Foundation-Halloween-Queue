class QueueManager {
    constructor(queues) {
        this.queues = queues || {};
        Object.keys(this.queues).forEach((queueName) => {
            this.queues[queueName].queueManager = this;
        });
    }
    getState() {
        return Object.keys(this.queues).reduce((state, queueName) => {
            state[queueName] = this.queues[queueName].getState();
            return state;
        }, {});
    }
    loadState(state) {
        Object.keys(this.queues).forEach((queueName) => {
            if (! state.hasOwnProperty(queueName)) return; // Skip if previous state doesn't include queue
            this.queues[queueName].loadState(state[queueName]);
        });
    }
}
module.exports = QueueManager;