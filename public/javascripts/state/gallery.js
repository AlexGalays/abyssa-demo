define(function(require) {

var State         = require('lib/abyssa').State,
    mainContent   = require('dom').mainContent,
    confirmDialog = require('confirmDialog'),
    animation     = require('stateChangeAnimation')
    template      = $('#gallery-template').html();


return State('gallery', {
  title: 'Gallery',
  
  enter: function() {
    // This stupid JQuery effect is actually unsafe, as it's not synchronized with the navigation.
    // The 'stateChangeAnimation' service/module on the other hand is safe.
    mainContent.html(template).hide().fadeIn(1000);
  },

  exitPrereqs: function() {
    animation.stop();
    return confirmDialog('Are you sure?');
  }

});


});