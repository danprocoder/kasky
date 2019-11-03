function Path (...paths) {
  console.log(paths)
  paths = paths
    .map(path =>
      typeof path === 'string' && this._removeTrailingSlash(path.trim())
    )

  this._pathname = this._removeTrailingSlash(paths.join('/'))
}

Path.prototype._removeTrailingSlash = function (path) {
  return path.replace(/^\/+|\/+$/g, '')
}

Path.prototype.match = function (pathname) {
  pathname = this._removeTrailingSlash(pathname)
  return pathname === this._pathname
}

module.exports = Path
