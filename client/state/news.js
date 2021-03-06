
var State        = require('abyssa').State,
    async        = require('abyssa').async,
    Q            = require('q'),
    ContentState = require('./contentState'),
    item         = require('../state/newsItem'),
    dom          = require('../dom'),
    spinner      = require('../spinner')(),
    controls     = require('../template/newsControls.hbs'),
    newsList     = require('../template/news.hbs');

var cachedNews;

var state = ContentState('news', {
  data: { title: 'News' },
  enter: enter,
  exit: exit,
}, {

  // The default news state, showing a list of all the news.
  show: State('?color', {
    enter: showEnter,
    update: showUpdate
  }),

  // The state representing one news entry.
  // Since the 'news' state is our parent, we get the red header background too!
  item: item

});


function enter() {
  dom.header.addClass('red');
}

function exit() {
  dom.header.removeClass('red');
  cachedNews = null;
}

function showEnter(params) {
  dom.headerControls.html(controls);
  showUpdate(params);
}

function showUpdate(params) {
  updateButtonSelection(params);

  startLoading();

  async(getNews().then(finishedLoading)).then(news => {

    cachedNews = news;

    // Filter based on the optional query string.
    var filtered = params.color
      ? news.items.filter(item => item.color == params.color)
      : news.items;
  
    renderItems(filtered);
  });
}

function renderItems(items) {
  dom.mainContent.html(newsList(items));
}

function startLoading() {
  spinner.show(dom.mainContent[0]);
}

function finishedLoading(news) {
  return spinner.hide().then(_ => news);
}

function updateButtonSelection(params) {
  dom.headerControls.find('a')
    .removeClass('selected')
    .filter('.' + (params.color || 'all')).addClass('selected');
}

function getNews() {
  if (cachedNews) return Q(cachedNews);

  // Simulate some network latency
  var latency = Q.defer();
  setTimeout(_ => latency.resolve(), 500 * Math.random());

  return latency.promise.then(_ =>
    $.getJSON('/assets/javascripts/newsData.json' + '?rand=' + Math.random())
  );
}


module.exports = state;