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
        self.title = "Add Group";
        self.id = "";
        
        var previousLength = 0;

        self.create = function () {
            self.createGroup = true;
            self.close();
        };

        self.close = function () {
            dialog.close(self, self);
        };
        
        self.activate = function (data) {
            if(data){
                self.title = "Edit Group";
                self.name(data.name);
                self.phoneNumber(data.phoneNumber);
                self.groupSize(data.groupSize);
                previousLength = 12;
                self.id = data.id;
            }
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
