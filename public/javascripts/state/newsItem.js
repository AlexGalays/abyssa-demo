define(function(require) {

var State        = require('lib/abyssa').State,
    Async        = require('lib/abyssa').Async,
    router       = require('router'),
    mainContent  = require('dom').mainContent,
    showTemplate = Handlebars.compile($('#news-item-template').html()),
    editTemplate = Handlebars.compile($('#news-item-edit-template').html()),
    cachedNews   = {},
    news;


return State(':id', {

  enter: function(params) {
    news = Async(getNews(params.id)).then(function(data) {

      if (!data) {
        mainContent.text('The news #' + params.id + " does not exist");
        throw new Error();
      }

      cachedNews[params.id] = data;
      return data;
    });

  },

  // The show and edit state share a common parent: news.item. This means that each of these states
  // do not need to fetch the news data again.
  show: State({
    enter: function(params) {
      mainContent.html(showTemplate());

      news.then(function(data) {
        finishedLoading();

        // Prepare the HTML using JQuery; We could also use a templating engine or a mix of the two.
        $('#news-item')
          .find('h1').text(data.title).end()
          .find('a').attr('href', router.link('news.item.edit', {id: params.id})).end()
          .find('div pre').text(newsBody(data));
      });

    }
  }),

  // The edit state has little work to do when directly coming from news.item or news.item.show
  edit: State('edit', {
    enter: function(params) {
      mainContent.html(editTemplate());

      news.then(function(data) {
        finishedLoading();

        $('#news-item-edit')
          .find('h1').text(data.title).end()
          .find('a').attr('href', router.link('news.item.show', {id: params.id})).end()
          .find('textarea').val(newsBody(data)).keydown(function(evt) {
            setTimeout(function() { data.body = evt.target.value; }, 0); 
          });
      });
    }
  })


});


function finishedLoading() {
  $('#fadingBarsG').remove();
  mainContent.find('.loading').removeClass('loading');
}

function getNews(id) {
  if (cachedNews[id]) return cachedNews[id];

  var latency = $.Deferred();
  setTimeout(function() { latency.resolve(); }, 800);

  // Simulate some network latency and load the full list of news then
  // extract the one we're interested in. Errr.
  return latency.then(function() {
    return $.getJSON('/assets/javascripts/newsData.json');
  }).then(function(data) {
    return data.items[id - 1];
  });
}

function newsBody(news) {
  return news.body ||
    (news.body = 'This is ' + news.title.replace('I am', '') + '.\n\nPlease edit me');
}


});