define(function(require) {
    var app = require('durandal/app'),
        ko = require('knockout'),
        system = require('durandal/system');

    function display() {
        var self = this;

        self.mazeQueue = ko.observableArray([]);
        self.zombieQueue = ko.observableArray([]);

    	app.data.on("state", function(data) {
            self.mazeQueue([]);
            if (data.maze.nextGroup) self.mazeQueue.unshift(data.maze.nextGroup);
            data.maze.queue.forEach(function(group) {
                self.mazeQueue.push(group);
            });

            self.zombieQueue([]);
            if (data.zombie.nextGroup) self.zombieQueue.unshift(data.zombie.nextGroup);
            data.zombie.queue.forEach(function(group) {
                self.zombieQueue.push(group);
            });
        });

        self.activate = function(){
        	app.data.emit("getState");
        }
    }

    return display;
});