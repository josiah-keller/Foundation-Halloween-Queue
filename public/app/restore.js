define(function(require) {
    var app = require('durandal/app'),
        ko = require('knockout'),
        system = require('durandal/system');
    
    var Restore = function(){
        var self = this;
        self.rows = ko.observableArray();
        
        app.data.on("database", function(rows){
            console.log(rows);
            self.rows(rows);
        });
        
        
        self.activate = function(){
            app.data.emit("getDB");   
        }
    }
    
    return Restore;

});