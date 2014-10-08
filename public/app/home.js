define(function(require) {
    var app = require('durandal/app'),
        dialog = require('plugins/dialog'),
        system = require('durandal/system');
    require('../lib/bootstrap/js/bootstrap');

    var self = {

    }

    //Context for showing bootstrap modal
    dialog.addContext('bootstrap', {
        addHost: function (theDialog) {
            theDialog.host = $('#myModal').get(0);
        },
        removeHost: function (theDialog) {
            setTimeout(function () {
                $('#myModal').modal('hide');
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            }, 200);

        },
        compositionComplete: function (child, parent, context) {
            var theDialog = dialog.getDialog(context.model);
            $('#myModal').modal('show');
        },
        attached: null
    });

    return self;
});
