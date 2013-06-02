define(function(require) {


var State    = require('lib/abyssa').State,
    Render   = require('lib/durendal'),
    item     = require('state/newsItem'),
    dom      = require('dom'),
    controls = $('#news-controls-template').html(),
    newsList = $('#news-template').html(),
    data;


return State('news', {
  title: 'News',

  // The entire news section is going to have that great red header background.
  enter: function() { dom.header.addClass('red'); },
  exit: function() { dom.header.removeClass('red'); },

  // The default news state, showing a list of all the news.
  show: State('?color', {

    enter: function(params, news) {
      dom.headerControls.html(controls);
      dom.mainContent.html(newsList);

      data = news;

      var items = data.items;

      // Filter based on the optional query string.
      var filtered = params.color
        ? items.filter(function(item) { return item.color == params.color; })
        : items;

      // And render in the DOM.
      Render(filtered).into('#main-content ul').each(function(node, item) {
        $(node)
          .find('h4').text(item.title).end()
          .find('.color').addClass(item.color).end()
          .find('a').attr('href', 'news/' + item.id);
      })();
    },

    enterPrereqs: function() {
      return data || $.getJSON('/assets/javascripts/newsData.json');
    },

    exit: function() {
      dom.headerControls.empty();
    }

  }),

  // The state representing one news entry. 
  // Since the 'news' state is our parent, we get the red header background too!
  item: item

});


});