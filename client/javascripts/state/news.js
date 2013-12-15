
var State     = require('abyssa').State,
    Async     = require('abyssa').Async,
    when      = require('when'),
    item      = require('../state/newsItem'),
    dom       = require('../dom'),
    spinner   = require('../spinner'),
    Hb        = require('handlebars');

var controls  = $('#news-controls-template').html(),
    newsList  = Hb.compile($('#news-template').html()),
    cachedNews;


var state = State('news', {
  title: 'News',

  // The entire news section is going to have that great red header background.
  enter: function() {
    dom.header.addClass('red');
    dom.mainContent.html('');
  },

  // We exit the whole news state subtree, clean up.
  exit: function() {
    dom.header.removeClass('red');
    dom.headerControls.empty();
    cachedNews = null;
  },

  // The default news state, showing a list of all the news.
  show: State('?color', {

    enter: function(params) {
      prepareDOM(params);

      Async(getNews()).done(function(news) {
        finishedLoading();

        cachedNews = news;

        // Filter based on the optional query string.
        var filtered = params.color
          ? news.items.filter(function(item) { return item.color == params.color; })
          : news.items;

        renderItems(filtered);
      });
    }

  }),

  // The state representing one news entry.
  // Since the 'news' state is our parent, we get the red header background too!
  item: item

});


function prepareDOM(params) {
  dom.headerControls.html(controls);

  spinner.spin(dom.mainContent[0]);

  updateButtonSelection(params);
}

function renderItems(items) {
  dom.mainContent.html(newsList(items));
}

function finishedLoading() {
  spinner.stop();
}

function updateButtonSelection(params) {
  dom.headerControls.find('a')
    .removeClass('selected')
    .filter('.' + (params.color || 'all')).addClass('selected');
}

function getNews() {
  if (cachedNews) return cachedNews;

  // Simulate some network latency
  var latency = when.defer();
  setTimeout(function() { latency.resolve(); }, 200);

  return latency.promise.then(function() {
    return $.getJSON('/assets/javascripts/newsData.json');
  });
}


module.exports = state;