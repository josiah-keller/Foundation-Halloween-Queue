define(function(require) {
    var app = require('durandal/app'),
        ko = require('knockout'),
        dialog = require('plugins/dialog'),
        system = require('durandal/system');

    function Chat(){
    	var self = this;
    	self.message = ko.observable('');
    	self.chatItems = ko.observableArray();

    	app.data.on("chatUpdate", function(chat){
    		self.chatItems(chat);
    	});

    	self.sendMessage = function(){
    		if(self.message() != ''){
    			var item = {};
    			item.sender = sessionStorage.username;
    			item.message = self.message();
    			app.data.emit('newChat', item);
    			self.message('');
    		}
    	}

    	self.activate = function(){
    		app.data.emit("getChat");
    	}

    }
    
    return Chat;

});