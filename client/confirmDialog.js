
var Q = require('q');
var dialog = $('#confirm-dialog');


function confirmDialog(title) {
  var confirmation = Q.defer();

  dialog.one('close', () => {
    dialog.off('click');
    confirmation.reject('Did not confirm');
  });

  dialog.foundation('reveal', 'open')
    .find('h2').text(title).end()
    .one('click', 'button', event => {
      var button = $(event.target);

      dialog.off('close');
      dialog.foundation('reveal', 'close');

      setTimeout(_ => {
        button.is('.confirm-yes') ? confirmation.resolve() : confirmation.reject('Did not confirm');
      }, 200);

    });

  return confirmation.promise;
}


module.exports = confirmDialog;