define(function(require) {

require('lib/foundation.min');

var dialog = $('#confirm-dialog');


function ConfirmDialog(title) {
  var confirmation = $.Deferred();

  dialog.foundation('reveal', 'open', {animation: 'fade', animationSpeed: 100})
    .find('h2').text(title).end()
    .one('click', 'button', function() {
      var button = $(this);
      dialog.foundation('reveal', 'close');

      setTimeout(function() {
        button.is('.confirm-yes') ? confirmation.resolve() : confirmation.reject();
      }, 100);

    });

  return confirmation.promise();
}


return ConfirmDialog;

});