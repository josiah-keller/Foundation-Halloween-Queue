define(function (require) {
    var app = require('durandal/app');
    var router = require('plugins/router');
    var ko = require('knockout');

    var self = {
        router: router,
        activate: function () {            
            if (sessionStorage.username != null && sessionStorage.password != null){
                var user = {};
                user.username = sessionStorage.username;
                user.password = sessionStorage.password;
                $.ajax({
                    url: "https://foundation-haunted-maze.herokuapp.com/login",
                    //url: "http://localhost:3000/login",
                    data: user,
                    dataType: 'json',
                    type: "POST",
                }).done(function(data){
                    if(data.authenticated == true){
                        app.authenticated(true);
                        app.permissions = data.permissions;
                    }
                }).fail(function(err){
                    console.log(err);
                });
            }
            
            router.map([
                { route: '', title:'Home', moduleId: 'home', nav: false },
                { route: 'login', title: 'Login', moduleId: 'login', nav: false}
            ]).buildNavigationModel();

            router.guardRoute = function(instance, instructions){
                if(app.authenticated() == false && instructions.fragment !== 'login'){
                    return "login";
                }
                return true;
            }
            return router.activate();
        },

        authenticated: ko.computed(function() {
            return app.authenticated();
        }, this),

        logout: function(){
            sessionStorage.clear();
            app.authenticated(false);
            app.permissions = null;
            router.navigate('login');
        }
    };

    console.log(self);
    return self;
});
