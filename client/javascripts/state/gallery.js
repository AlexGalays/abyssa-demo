
var ContentState  = require('./contentState'),
    mainContent   = require('../dom').mainContent,
    confirmDialog = require('../confirmDialog'),
    template      = $('#gallery-template').html();


module.exports = ContentState('gallery', {
  data: { title: 'Gallery' },
  
  enter: function() {
    mainContent.html(template);
  },

  exitPrereqs: function() {
    return confirmDialog('Are you sure?');
  }

});