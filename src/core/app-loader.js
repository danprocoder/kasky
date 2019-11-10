const path = require('path')
const fileHelper = require('../helpers/file')

/**
 * Load user's app.
 *
 * @param {string} controllersPath The directory to where the controllers are stored.
 */
function loadApp (controllersPath) {
  return new Promise(resolve => {
    fileHelper.matches(path.join(controllersPath, '**', '*.js'), (files) => {
      files.forEach((filepath) => {
        require(filepath)
      })

      resolve()
    })
  })
}

exports.loadApp = loadApp
