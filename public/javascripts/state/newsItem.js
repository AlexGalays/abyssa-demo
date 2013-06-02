define(function(require) {

var State        = require('lib/abyssa').State,
    router       = require('router'),
    mainContent  = require('dom').mainContent,
    showTemplate = $('#news-item-template').html(),
    editTemplate = $('#news-item-edit-template').html(),
    cachedNews   = {},
    news;

return State(':id', {

  enter: function(params, data) {
    // Store the news data as a local var so that our child state can use it.
    news = data;

    // Throwing an error will cancel the transition.
    if (!news) {
      mainContent.text('The news #' + params.id + " does not exist");
      throw new Error();
    }

    cachedNews[params.id] = news;
  },
  enterPrereqs: function(params) {
    if (cachedNews[params.id]) return cachedNews[params.id];

    var latency = $.Deferred();
    setTimeout(function() { latency.resolve(); }, 800);

    // Simulate some network latency and load the full list of news then
    // extract the one we're interested in. Errr.
    return latency.then(function() {
      return $.getJSON('/assets/javascripts/newsData.json');
    }).then(function(data) {
      return data.items[params.id - 1];
    });
  },

  // The show and edit state share a common parent: news.item. This means that each of these states
  // do not need to fetch the news data again.
  show: State({
    enter: function(params) {
      mainContent.html(showTemplate);

      // Prepare the HTML using JQuery; We could also use a templating engine or a mix of the two.
      $('#news-item')
        .find('h1').text(news.title).end()
        .find('a').attr('href', router.link('news.item.edit', {id: params.id})).end()
        .find('div pre').text(newsBody());
    }
  }),

  // The edit state has little work to do when directly coming from news.item or news.item.show
  edit: State('edit', {
    enter: function(params) {
      mainContent.html(editTemplate);

      $('#news-item-edit')
        .find('h1').text(news.title).end()
        .find('a').attr('href', router.link('news.item.show', {id: params.id})).end()
        .find('textarea').val(newsBody()).keydown(function(evt) {
          setTimeout(function() { news.body = evt.target.value; }, 0); 
        });
    }
  })


});

function newsBody() {
  return news.body ||
    (news.body = 'This is ' + news.title.replace('I am', '') + '.\n\nPlease edit me');
}


});