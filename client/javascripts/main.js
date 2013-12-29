
require('es5-shim');

require('./hb');
require('./router');


// *_* @#?! Don't use these components at home...
$(document).foundation({
  reveal: {
    animation: 'fade',
    animation_speed: 100
  }
});