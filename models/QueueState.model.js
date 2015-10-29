var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var queueStateSchema = mongoose.Schema({
	op: String,
	state: String,
	time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QueueState', queueStateSchema);
