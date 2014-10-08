define(function(require) {
    var app = require('durandal/app'),
        system = require('durandal/system'),
        ko = require('knockout');


    var home = function(){
	var self = this;
	self.state = ko.observable("");

	self.socket = app.data;
	self.socket.on('state', function(data){
	    console.log(data);
	    self.state(data);
	});

	self.add = function(){
	    self.socket.emit('add group', {name: "Bob"});
	}

	self.remove = function(){
	    self.socket.emit('remove group', 0);
	}

	self.next = function(){
	    self.socket.emit('next');
	}

    }

    return home;
});
