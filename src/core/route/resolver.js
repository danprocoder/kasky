const register = require('./register')

/**
 * @param {string} method The HTTP request method
 * @param {string} pathname The request URL pathname
 *
 * @returns {boolean|object}
 */
exports.resolve = function (method, pathname) {
  const route = register._routes.find(route => {
    return route.method === method && route.path.match(pathname)
  })
  return route ? {
    ...route.resolveTo,
    middlewares: route.middlewares
  } : false
}
