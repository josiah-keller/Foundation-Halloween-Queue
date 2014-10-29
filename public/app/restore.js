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

        self.restore = function (state){
            app.showMessage("Are you sure you want to restore to state "+state.rowid, null, [ { text: "Yes", value: true }, { text: "No", value: false }])
            .then(function(val){
                app.data.emit("restore", state.rowid);
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
            window.location = "http://localhost:3000/download"
        }
        
        
        self.activate = function(){
            if(app.permissions =="admin"){
                app.data.emit("getDB");
            }else{
                app.showMessage("Access Denied");
                router.navigate("");
            }
               
        }
    }
    
    return Restore;

});