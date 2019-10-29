const path = require('path')

/**
 * Load user's app.
 *
 * @param {string} projectDir Full absolute path to where to find app.js in the build directory.
 */
function loadApp (projectDir) {
  // Load app.js
  return require(path.join(projectDir, 'app'))
}

exports.loadApp = loadApp
