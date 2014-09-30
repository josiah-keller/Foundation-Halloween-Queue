define(function (require) {
  console.log(0)
  var router = require('plugins/router');
  console.log(1);
  var self = {
     router: router,
     activate: function () {
       router.map([
         { route: '', title:'Home', moduleId: 'home', nav: true }
       ]).buildNavigationModel();
 
       return router.activate();
     }
   };

   return self;
});
