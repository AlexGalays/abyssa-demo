
var Router         = require('abyssa').Router,
    dom            = require('./dom'),
    sectionTitle   = dom.sectionTitle,
    headerControls = dom.headerControls;

var router = Router({
  index:    require('./state/index'),
  news:     require('./state/news'),
  gallery:  require('./state/gallery')
})
.configure({
  enableLogs: true,
  interceptAnchors: true,
  notFound: require('./state/notFound')
})
.init();

// While the router is initializing, we don't want to display a half-baked application.
router.transition.ended.addOnce(function() {
  dom.header[0].style.opacity = 1;
});

// To keep things dry, logic spanning multiple states can be expressed once globally.
router.transition.completed.add(function(newState) {
  sectionTitle.text(newState.data('title'));
  sectionTitle.css('margin-top', headerControls.children().length ? 0 : 28);
});


module.exports = router;