define(function(require) {

  var Router         = require('lib/abyssa').Router,
      sectionTitle   = require('dom').sectionTitle,
      headerControls = require('dom').headerControls;

  Router.enableLogs();

  var router = Router();

  // To keep things dry, logic spanning multiple states can be expressed once globally.
  router.transition.completed.add(function(oldState, newState) {
    sectionTitle.text(newState.data('title'));
    sectionTitle.css('margin-top', headerControls.children().length ? 0 : 28);
  });

  return router;

});