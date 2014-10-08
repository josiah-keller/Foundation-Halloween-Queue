define(function (require) {

    var router = require('plugins/router');

    var self = {
        router: router,
        activate: function () {
            router.map([
                { route: '', title:'Home', moduleId: 'home', nav: false }
            ]).buildNavigationModel();

            return router.activate();
        }
    };

    return self;
});
