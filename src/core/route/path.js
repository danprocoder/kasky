const pathToRegex = require('../../helpers/pathToRegex')

function Path (...paths) {
  paths = paths
    .map(path =>
      typeof path === 'string' && this._removeTrailingSlash(path.trim())
    )

  this._pathname = this._removeTrailingSlash(paths.join('/'))
  this._regex = pathToRegex(this._pathname)
}

Path.prototype._removeTrailingSlash = function (path) {
  return path.replace(/^\/+|\/+$/g, '')
}

Path.prototype.match = function (pathname) {
  // Ensure pathname begins with a backslash before testing
  if (!pathname.match(/^\//)) {
    pathname = '/' + pathname
  }
  pathname = pathname.replace(/\/+$/, '')
  return this._regex.exec(pathname)
}

module.exports = Path
