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
                    url: app.url,
                    data: user,
                    dataType: 'json',
                    type: "POST",
                }).done(function(data){
                    if(data.authenticated == true){
                        app.authenticated(true);
                        app.permissions = data.permissions;
                        app.username = sessionStorage.username;
                    }
                }).fail(function(err){
                    console.log(err);
                });
            }
            
            router.map([
                { route: '', title:'Home', moduleId: 'home', nav: false },
                { route: 'login', title: 'Login', moduleId: 'login', nav: false},
                { route: 'display', title: 'Display', moduleId: 'display', nav: true},
                { route: 'restore', title: 'Restore', moduleId: 'restore', nav: true},
            ]).buildNavigationModel();

            router.guardRoute = function(instance, instructions){
                if(app.authenticated() == false && instructions.fragment === 'display'){
                    return true;
                }
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
            router.navigate('login');
            location.reload();
        }
    };

    return self;
});
