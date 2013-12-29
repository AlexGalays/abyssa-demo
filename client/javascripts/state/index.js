
var ContentState = require('./contentState'),
    mainContent  = require('../dom').mainContent;

module.exports = ContentState('', {
  // This is a custom data property.
  data: { title: 'Home page' },
  
  enter: function() {
    mainContent.text('This is the index. Check "News" for an example of nested states');
  }
});