
var ContentState  = require('./contentState'),
    mainContent   = require('../dom').mainContent,
    template      = require('../template/gallery.hbs');


module.exports = ContentState('gallery', {
  data: { title: 'Gallery' },
  
  enter: function() {
    mainContent.html(template);
  }

});