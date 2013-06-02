define(function(require) {

var dom       = require('dom'),
    animation =  $($('#animation').html().trim()),
    timeout;

// Show an animation in the app's main area unless the transition is near-synchronous.
function start() {
  timeout = setTimeout(function() {
    dom.mainContent.css('opacity', 0.15);
    animation.appendTo(dom.contentParent);
    timeout = null;
  }, 20);
}

function stop() {
  if (timeout) {
    clearTimeout(timeout);
    return;
  }

  dom.mainContent.css('opacity', 1);
  animation.remove();
}

return {
  start: start,
  stop: stop
};

});