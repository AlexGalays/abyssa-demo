
var State         = require('abyssa').State,
    mainContent   = require('../dom').mainContent,
    confirmDialog = require('../confirmDialog'),
    template      = $('#gallery-template').html();


module.exports = State('gallery', {
  title: 'Gallery',
  
  enter: function() {
    mainContent.html(template);
  },

  exitPrereqs: function() {
    return confirmDialog('Are you sure?');
  }

});