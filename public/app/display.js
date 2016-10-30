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
            var pastPending = false, previousPending = null, pendingCount = 0;

            if (data.maze.nextGroup) self.mazeQueue.unshift(data.maze.nextGroup);
            data.maze.queue.forEach(function(group, i) {
                console.log("MAZE GROUP", group);
                if (! pastPending) {
                    if (! group.pending || i === data.maze.queue.length - 1) {
                        pastPending = true;
                        if (pendingCount > 1) {
                            self.mazeQueue.push({ pending: true, name: pendingCount + " pending" });
                        } else if (pendingCount === 1) {
                            self.mazeQueue.push(previousPending);
                        }
                        self.mazeQueue.push(group);
                    } else {
                        pendingCount += 1;
                        previousPending = group;
                    }
                } else {
                    self.mazeQueue.push(group);
                }
            });

            self.zombieQueue([]);
            pastPending = false;
            previousPending = null;
            pendingCount = 0;

            if (data.zombie.nextGroup) self.zombieQueue.unshift(data.zombie.nextGroup);
            data.zombie.queue.forEach(function(group, i) {
                console.log("ZOMBIE GROUP", group);
                if (! pastPending) {
                    if (! group.pending || i === data.zombie.queue.length - 1) {
                        pastPending = true;
                        if (pendingCount > 1) {
                            self.zombieQueue.push({ pending: true, name: pendingCount + " pending" });
                        } else if (pendingCount === 1) {
                            self.zombieQueue.push(previousPending);
                        }
                        self.zombieQueue.push(group);
                    } else {
                        pendingCount += 1;
                        previousPending = group;
                    }
                } else {
                    self.zombieQueue.push(group);
                }
            });
        });

        self.nameDisplay = function(name, pending) {
            return name + (pending ? " (pending)" : "");
        };

        self.activate = function(){
        	app.data.emit("getState");
        }
    }

    return display;
});