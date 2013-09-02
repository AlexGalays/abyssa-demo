define(function(require) {

require('partials');
require('router');

var dom = require('dom');

// Intercepts all anchor clicks and handle the routing on the client.
dom.body.on('click', 'a', function(evt) {
  evt.preventDefault();

  router.state($(this).attr('href'));
});


});