define(function(require) {

var State       = require('lib/abyssa').State,
    mainContent = require('dom').mainContent;

return State({
  title: "Oops",
  
  enter: function() {
    mainContent.html('<h1>404</h1>');
  }
});


});