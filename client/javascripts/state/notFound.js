
var State       = require('abyssa').State,
    mainContent = require('../dom').mainContent;

module.exports = State({
  title: "Oops",

  enter: function() {
    mainContent.html('<h1>404</h1>');
  }

});