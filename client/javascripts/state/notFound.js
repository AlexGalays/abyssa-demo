
var ContentState = require('./contentState'),
    mainContent  = require('../dom').mainContent;

module.exports = ContentState('notFound', {
  data: { title: "Oops" },

  enter: function() {
    mainContent.html('<h1>404</h1>');
  }

});