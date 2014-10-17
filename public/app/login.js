define(function(require) {
    var app = require('durandal/app'),
        dialog = require('plugins/dialog'),
        ko = require('knockout'),
        router = require('plugins/router');
        system = require('durandal/system');
    
    function login(){
    	var self = this;
    	self.username = ko.observable('');
    	self.password = ko.observable('');

    	self.submit = function(){
    		var user = {};
    		user.username = self.username();
    		user.password = self.password();
    		$.ajax({
    			//url: "https://foundation-haunted-maze.herokuapp.com/login",
                url: "http://localhost:3000/login",
                data: user,
                dataType: 'json',
                type: "POST",
    		}).done(function(data){
    			console.log(data.authenticated);
    			if(data.authenticated == true){
    				router.navigate("/");
    			}
    		}).fail(function(err){
    			console.log(err);
    		})
    	}
    }

    return login;

});