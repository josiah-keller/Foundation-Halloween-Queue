define(function (require) {

    var router = require('plugins/router');

    var self = {
        router: router,
        activate: function () {
            router.map([
                { route: '', title:'Home', moduleId: 'home', nav: false },
                { route: 'login', title: 'Login', moduleId: 'login', nav: true}
            ]).buildNavigationModel();

            return router.activate();
        }
    };

    return self;
});
