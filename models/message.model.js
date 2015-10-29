var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
	sender: String,
	message: String,
	time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);