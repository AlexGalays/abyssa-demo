
var router     = require('./router'),
    Handlebars = require("hbsfy/runtime");


Handlebars.registerHelper('link', (state, options) => {
  return new Handlebars.SafeString('href="' + router.link(state, options.hash) + '"');
});