define(function(require) {
    var app = require('durandal/app'),
        ko = require('knockout'),
        router = require('plugins/router');
        system = require('durandal/system');
        require('bootstrap');
    
    var Restore = function(){
        var self = this;
        self.rows = ko.observableArray();
        
        app.data.on("database", function(rows){
            for (var i = 0; i<rows.length; i++){
                rows[i].state = JSON.parse(rows[i].state);
            }
            self.rows(rows);
        });

        self.currentGroupName = function(group){
            if(group != null){
                return "Current: " + group.name;
            }else{
                return "Current: null";
            }
        }

        self.restore = function (state, index){
            app.showMessage("Are you sure you want to restore to state "+ index, null, [ { text: "Yes", value: true }, { text: "No", value: false }])
            .then(function(val){
                app.data.emit("restore", index);
            })
        }

        self.nextGroupName = function(group){
            if(group != null){
                return "Next: " + group.name;
            }else{
                return "Next: null";
            }
        }

        self.download = function(){
            window.location = "https://foundation-haunted-maze.herokuapp.com/download";
        }
        
        
        self.activate = function(){
            if(app.permissions =="admin"){
                app.data.emit("getDB", "maze");
            }else{
                app.showMessage("Access Denied");
                router.navigate("");
            }
        }
        
        self.detached = function() {
            app.data.off("database");
        }
    }
    
    return Restore;

});