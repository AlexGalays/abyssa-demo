var Q       = require('q'),
    Spinner = require('spin.js');


// How much time to delay the spinner.
// This is so near-instantanate operations (cached calls, etc) never show a spinner.
var SHOW_DELAY = 150;
// Once shown, the minimum time the spinner should be shown.
// This is so a spinner cannot flash briefly on screen, creating a feeling of unsteadiness.
var HIDE_DELAY = 100;


function makeSpinner() {
  var showTime, showDelay, hideDelay;

  var spinner = new Spinner({
    top: '30px',
    lines: 15,
    length: 8,
    width: 3,
    radius: 10,
    speed: 1.5
  });

  function show(el) {
    if (showDelay) return Q.reject('already shown');
    hideDelay = null;

    showDelay = Q.defer();
    setTimeout(function() {
      if (showDelay) showDelay.resolve(el);
      showDelay = null;
    }, SHOW_DELAY);

    return showDelay.promise.then(doShow);
  }

  function doShow(el) {
    showTime = +new Date();
    spinner.spin(el);
  }

  function hide() {
    if (hideDelay) return Q.reject('already hidden');
    showDelay = null;

    var now = +new Date();
    var timeElapsed = now - showTime;
    var delay = Math.max(0, HIDE_DELAY - timeElapsed);

    hideDelay = Q.defer();
    setTimeout(function() {
      if (hideDelay) hideDelay.resolve();
      hideDelay = null;
    }, delay);

    return hideDelay.promise.then(doHide);
  }

  function doHide() {
    spinner.stop();
  }

  return {
    el:   function() { return spinner.el; },
    show: show,
    hide: hide
  };

}


module.exports = makeSpinner;