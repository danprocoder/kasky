const path = require('path');

// Load user's app.
exports.loadApp = function(projectDir) {
  // Load app.js
  return require(path.join(projectDir, 'app'));
}
