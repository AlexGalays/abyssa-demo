
var Router         = require('abyssa').Router,
    dom            = require('./dom'),
    sectionTitle   = dom.sectionTitle,
    headerControls = dom.headerControls;

var router = Router({
  index:    require('./state/index'),
  news:     require('./state/news'),
  gallery:  require('./state/gallery'),
  notFound: require('./state/notFound')
})
.configure({
  enableLogs: true,
  interceptAnchors: true,
  notFound: 'notFound'
});

// To keep things dry, logic spanning multiple states can be expressed once globally.
router.transition.on('ended', newState => {
  sectionTitle.text(newState.data('title'));
  sectionTitle.css('margin-top', headerControls.children().length ? 0 : 28);
});

router.init();


module.exports = router;