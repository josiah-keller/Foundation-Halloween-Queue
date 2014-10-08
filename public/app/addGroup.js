define(function(require) {
    var app = require('durandal/app'),
        ko = require('knockout'),
        dialog = require('plugins/dialog'),
        system = require('durandal/system');


    function AddGroup () {
        var self = this;

        self.name = ko.observable();
        self.phoneNumber = ko.observable();

        self.create = function () {
            console.log(self);
            self.createGroup = true;
            self.close();
        };

        self.close = function () {
            dialog.close(self, self);
        };
    };

    return AddGroup;
});
