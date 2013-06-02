define(function(require) {

var router    = require('router'),
    body      = require('dom').body,
    animation = require('stateChangeAnimation');


router.addState('index', require('state/index'));
router.addState('news', require('state/news'));
router.addState('gallery', require('state/gallery'));
router.addState('notFound', require('state/notFound'));

// While the router is initializing, we don't want to display a half-baked application.
router.transition.ended.addOnce(function() {
  body.removeClass('loading');
});

// Display an animation when the router is busy
router.transition.started.add(animation.start);
router.transition.ended.add(animation.stop);

router.init();

// Intercepts all anchor clicks and handle the routing on the client.
body.on('click', 'a', function(evt) {
  evt.preventDefault();

  router.state($(this).attr('href'));
});

});