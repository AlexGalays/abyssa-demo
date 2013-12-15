
var State       = require('abyssa').State,
    mainContent = require('../dom').mainContent;

module.exports = State({
  // This is a custom data property.
  title: 'Home page',
  
  enter: function() {
    mainContent.text('This is the index. Check "News" for an example of nested states');
  }
});
