define(function(require) {
    var app = require('durandal/app'),
        ko = require('knockout'),
        system = require('durandal/system');

    function display(){
    	var self = this;

    	self.nextGroup = ko.observableArray([]);
    	self.queuedGroups = ko.observableArray([]);

    	self.getNextGroupName = function(){
    		return "1. " + self.nextGroup().name + " - " + self.nextGroup().groupSize;
    	}

    	self.getQueuedGroupName = function(index){
    		var num = index+2
    		var group = self.queuedGroups()[index];
    		console.log(group)
    		return num + ". " + group.name + " - " + group.groupSize;
    	}

    	app.data.on("state", function(data){
            console.log('state change', data);
            self.nextGroup(data.nextGroup);
            self.queuedGroups(data.queue);
        });

        self.activate = function(){
        	app.data.emit("getState");
        }
    }

    return display;

});