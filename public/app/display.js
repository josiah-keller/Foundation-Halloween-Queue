define(function(require) {
    var app = require('durandal/app'),
        ko = require('knockout'),
        system = require('durandal/system');

    function display(){
    	var self = this;

    	self.queuedGroups = ko.observableArray([]);
        self.queuedGroups2 = ko.observableArray([]);

    	self.getQueuedGroupName = function(index){
    	    var num = index+1
    		var group = self.queuedGroups()[index];
    		return num + ". " + group.name + " - " + group.groupSize;
    	}

        self.getQueuedGroup2Name = function(index){
            var num = index+18
            var group = self.queuedGroups2()[index];
            return num + ". " + group.name + " - " + group.groupSize;
        }

    	app.data.on("state", function(data){
            self.queuedGroups([]);
            self.queuedGroups2([]);
            if(data.nextGroup) self.queuedGroups.unshift(data.nextGroup);
            for(var i = 0; i<data.queue.length; i++){
                if(i<16){
                    self.queuedGroups.push(data.queue[i]);
                }else{
                    self.queuedGroups2.push(data.queue[i]);
                }
            }
            
        });

        self.activate = function(){
        	app.data.emit("getState");
        }
    }

    return display;

});