requirejs.config({
  paths: {
    'text': '../lib/require/text',
    'durandal':'../lib/durandal/js',
    'plugins' : '../lib/durandal/js/plugins',
    'transitions' : '../lib/durandal/js/transitions',
    'knockout': '../lib/knockout/knockout-3.1.0',
    'jquery': '../lib/jquery/jquery-1.9.1',
    'bootstrap': '../lib/bootstrap/js/bootstrap.min'
    } 
});
 
define(function (require) {
   var system = require('durandal/system'),
       ko = require('knockout'),
       app = require('durandal/app');
 
   system.debug(true);
 
   app.title = 'Foundation Halloween Open House';
   
   app.data = io();
   app.authenticated = ko.observable(false);
   app.permissions = null;

   //app.url = "https://foundation-haunted-maze.herokuapp.com/login";
   app.url = "http://foundationqueue.azurewebsites.net/login";

   app.configurePlugins({
     router:true,
     dialog: true
   });
 
   app.start().then(function() {
     app.setRoot('shell');
   });
});
