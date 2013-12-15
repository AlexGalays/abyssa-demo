
var State        = require('abyssa').State,
    mainContent  = require('../dom').mainContent,
    Hb           = require('handlebars'),
    when         = require('when'),
    Zanimo       = require('zanimo'),
    spinner      = require('../spinner'),
    showTemplate = Hb.compile($('#news-item-template').html()),
    editTemplate = Hb.compile($('#news-item-edit-template').html()),
    cachedNews   = {},
    sidePanel    = $('#side-panel'),
    panelContent = $('#side-panel-content'),
    news,
    panelOpened;


var state = State(':id', {

  enter: function(params) {
    $(document).on('click', onDocumentClick);

    var panel = openPanel();

    var newsData = when(getNews(params.id)).then(function(data) {
      if (!data) {
        mainContent.text('The news #' + params.id + " does not exist");
        throw new Error();
      }

      cachedNews[params.id] = data;
      return data;
    });

    news = this.async(when.all([panel, newsData]))
      .then(function(values) { return values[1]; });
  },

  exitPrereqs: function() {
    if (!this.router.currentState().isIn(this.fullName))
      return closePanel();
  },

  exit: function() {
    $(document).off('click', onDocumentClick);
  },

  // The show and edit state share a common parent: news.item. This means that each of these states
  // do not need to fetch the news data again.
  show: State({
    enter: function(params) {

      news.done(function(data) {
        showContent(showTemplate({
          id: params.id,
          title: data.title,
          body: newsBody(data)
        }));

      });

    }
  }),

  // The edit state has little work to do when directly coming from news.item or news.item.show
  edit: State('edit', {
    enter: function(params) {

      news.done(function(data) {
        showContent(editTemplate({
          id: params.id,
          title: data.title,
          body: newsBody(data)
        }));

        $('#news-item-edit').find('textarea').keydown(function(evt) {
          setTimeout(function() { data.body = evt.target.value; }, 0);
        });
      });

    }
  })

});


function openPanel() {
  if (panelOpened)
    return when(startLoading)
  else {
    panelOpened = true;
    return Zanimo.transition(sidePanel[0], 'transform', 'translate3d(0, 0, 0)', 300, 'ease').then(startLoading);
  }
}

function closePanel() {
  panelOpened = false;
  return Zanimo.transition(sidePanel[0], 'transform', 'translate3d(100%, 0, 0)', 100, 'ease')
    .then(resetPanelContent);
}

function startLoading() {
  spinner.spin(panelContent[0]);
}

function showContent(content) {
  spinner.stop();
  panelContent.html(content);
}

function onDocumentClick(event) {
  var target = $(event.target);
  var isAnchor = target.is('a') || target.parents('a').length > 0;

  if (isAnchor) return;

  var isOutsidePanel = (target.parents('#side-panel').length == 0);

  if (isOutsidePanel) backToNews();
}

function backToNews() {
  state.router.backTo('news.show');
}

function resetPanelContent() {
  panelContent.html('');
}

function getNews(id) {
  if (cachedNews[id]) return cachedNews[id];

  var latency = when.defer();
  setTimeout(function() { latency.resolve(); }, 400);

  // Simulate some network latency and load the full list of news then
  // extract the one we're interested in. Errr.
  return latency.promise.then(function() {
    return $.getJSON('/assets/javascripts/newsData.json');
  }).then(function(data) {
    return data.items[id - 1];
  });
}

function newsBody(news) {
  return news.body ||
    (news.body = 'This is ' + news.title.replace('I am', '') + '.\n\nPlease edit me');
}


module.exports = state;