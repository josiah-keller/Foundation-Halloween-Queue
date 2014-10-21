define(function(require) {
    var app = require('durandal/app'),
        ko = require('knockout'),
        dialog = require('plugins/dialog'),
        system = require('durandal/system');


    function AddGroup () {
        var self = this;

        self.name = ko.observable();
        self.phoneNumber = ko.observable();
        self.groupSize = ko.observable(1);
        
        var previousLength = 0;

        self.create = function () {
            self.createGroup = true;
            self.close();
        };

        self.close = function () {
            dialog.close(self, self);
        };
        
        self.activate = function () {
            self.phoneNumber.subscribe(function(value) {
                var forward = value.length > previousLength;
                previousLength = value.length;
                // If adding numbers
                if (forward && (value.length == 3 || value.length == 7))
                    self.phoneNumber(value + '-');
                // If deleteing numbers
                if (!forward && (value.length == 4 || value.length == 8))
                    self.phoneNumber(value.substr(0, value.length-1));
            });
        };
    };

    return AddGroup;
});
