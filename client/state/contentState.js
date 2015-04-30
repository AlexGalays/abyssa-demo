
var State = require('abyssa').State,
    dom   = require('../dom');

/*
* Constructor for top level states that output their content in the main area.
*/
function ContentState(uri, options, children) {
  var state = State(uri, options, children);

  state.exit = function() {
    onContentExit(state);
    if (options.exit) options.exit();
  };

  return state;
}


function onContentExit(state) {
  dom.mainContent.html('');
  dom.headerControls.html('');
}


module.exports = ContentState;