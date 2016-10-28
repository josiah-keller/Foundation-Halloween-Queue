class QueueManager {
    constructor(queues) {
        this.queues = queues || {};
    }
    getState() {
        return Object.keys(this.queues).reduce((state, queueName) => {
            state[queueName] = this.queues[queueName].getState();
            return state;
        }, {});
    }
    loadState(state) {
        Object.keys(this.queues).forEach((queueName) => {
            this.queues[queueName].loadState(state[queueName]);
        });
    }
}
module.exports = QueueManager;