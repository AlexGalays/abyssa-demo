
var State        = require('abyssa').State,
    Async        = require('abyssa').Async,
    mainContent  = require('../dom').mainContent,
    Q            = require('q'),
    Zanimo       = require('zanimo'),
    spinner      = require('../spinner')(),
    showTemplate = require('../template/newsItem.hbs'),
    editTemplate = require('../template/newsItemEdit.hbs'),
    cachedNews   = {},
    sidePanel    = $('#side-panel'),
    panelContent = $('#side-panel-content'),
    news,
    panelOpened;


var state = State(':id', {
  enter: enter,
  exit: exit,

  show: State('', showEnter),
  edit: State('edit', {
    enter: editEnter,
    exit: editExit
  })
});


function enter(params) {
  $(document).on('click', onDocumentClick);
  $(document).on('keyup', onDocumentKeyup);

  var panel = Q(openPanel()).then(startLoading);

  var newsData = Q(getNews(params.id)).then(data => {
    cachedNews[params.id] = data;
    return data;
  });

  news = this.async(Q.all([panel, newsData]))
    .then(values => values[1]);
}

function exit() {
  $(document).off('click', onDocumentClick);
  $(document).off('keyup', onDocumentKeyup);

  var destination = this.router.currentState();

  if (destination.is('news.show'))
    closePanel();
  else if (!destination.isIn(this.fullName))
    closePanel(true);
  else resetPanelContent();
}

function showEnter(params) {
  news.done(data => {

    showContent(showTemplate({
      id: params.id,
      title: data.title,
      body: newsBody(data)
    }));

  });
}

function editEnter(params) {
  news.done(showEditMode);

  function showEditMode(data) {
    showContent(editTemplate({
      id: params.id,
      title: data.title,
      body: newsBody(data)
    }))
    .done(editOnKeyUp(data));
  }
}

function editExit() {
  $('#news-item-edit').find('textarea').off('keyup');
}

function editOnKeyUp(data) {
  return function() {
    $('#news-item-edit').find('textarea').keyup(evt => {
      data.body = evt.target.value;
    });
  };
}

function openPanel() {
  if (panelOpened)
    return 'alreadyOpened';
  else {
    panelOpened = true;
    return Zanimo.transition(sidePanel[0], 'transform', 'translate3d(0, 0, 0)', 300, 'ease');
  }
}

function closePanel(atOnce) {
  panelOpened = false;

  var animation = atOnce 
    ? Zanimo.transform(sidePanel[0], 'translate3d(100%, 0, 0)', true)
    : Zanimo.transition(sidePanel[0], 'transform', 'translate3d(100%, 0, 0)', 100, 'ease')

  animation.then(resetPanelContent);
}

function startLoading() {
  spinner.show(panelContent[0]);
}

function showContent(content) {
  return Async(spinner.hide()).then(_ =>
    panelContent.html(content)
  );
}

function onDocumentClick(event) {
  var target = $(event.target);
  var isAnchor = target.is('a') || target.parents('a').length > 0;

  if (isAnchor) return;

  var isOutsidePanel = (target.parents('#side-panel').length == 0);

  if (isOutsidePanel) backToNews();
}

function onDocumentKeyup(event) {
  // ESCAPE
  if (event.keyCode == 27) backToNews();
}

function backToNews() {
  state.router.backTo('news.show');
}

function resetPanelContent() {
  panelContent.html('');
}

function getNews(id) {
  if (cachedNews[id]) return cachedNews[id];

  var latency = Q.defer();
  setTimeout(_ => latency.resolve(), 400);

  // Simulate some network latency and load the full list of news then
  // extract the one we're interested in. Errr.
  return latency.promise.then(_ =>
    $.getJSON('/assets/javascripts/newsData.json' + '?rand=' + Math.random())
  ).then(data => {
    var news = data.items[id - 1];
    if (!news)  throw new Error('news not found');
    return news;
  });
}

function newsBody(news) {
  return news.body ||
    (news.body = 'This is ' + news.title.replace('I am', '') + '.\n\nPlease edit me');
}


module.exports = state;