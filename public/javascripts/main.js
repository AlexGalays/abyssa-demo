define(function(require) {

require('partials');

var router    = require('router'),
    dom       = require('dom');


router.addState('index', require('state/index'));
router.addState('news', require('state/news'));
router.addState('gallery', require('state/gallery'));
router.addState('notFound', require('state/notFound'));

// While the router is initializing, we don't want to display a half-baked application.
router.transition.ended.addOnce(function() {
  dom.header[0].style.opacity = 1;
});

router.init();

// Intercepts all anchor clicks and handle the routing on the client.
dom.body.on('click', 'a', function(evt) {
  evt.preventDefault();

  router.state($(this).attr('href'));
});

});