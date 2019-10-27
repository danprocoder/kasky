const path = require('path');

// Load user's app.
exports.loadApp = function() {
  const appModule = require(path.join(process.cwd(), 'app'));
}
