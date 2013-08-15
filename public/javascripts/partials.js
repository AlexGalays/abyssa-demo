define(function(require) {

Handlebars.registerPartial(
  'loading-animation',
  Handlebars.compile($("#animation").html())
);

});