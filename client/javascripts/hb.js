
var router = require('./router'),
    Hb     = require('handlebars');


Hb.registerHelper('link', function(state, options) {
  return new Hb.SafeString('href="' + router.link(state, options.hash) + '"');
});