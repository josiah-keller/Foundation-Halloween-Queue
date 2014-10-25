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
    			url: app.url,
                data: user,
                dataType: 'json',
                type: "POST",
    		}).done(function(data){
    			if(data.authenticated == true){
                    sessionStorage.username = user.username;
                    sessionStorage.password = user.password;
                    app.authenticated(true);
                    app.permissions = data.permissions;
    				router.navigate("/");
    			}
    		}).fail(function(err){
    			console.log(err);
    		});
    	}
    }

    return login;

});