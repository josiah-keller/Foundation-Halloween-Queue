define(function (require) {
    var app = require('durandal/app');
    var router = require('plugins/router');
    var ko = require('knockout');

    var self = {
        router: router,
        activate: function () {
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
            app.authenticated(false);
            app.permissions = null;
            router.navigate('login');
        }
    };

    console.log(self);
    return self;
});
