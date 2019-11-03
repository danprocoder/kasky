const register = require('./register')
const Path = require('./path')

/**
 * @param {string} method The HTTP request method
 * @param {string} pathname The request URL pathname
 *
 * @returns {boolean|object}
 */
exports.resolve = function (method, pathname) {
  const route = register._routes.find(route => {
    const routePath = new Path(
      route.resolveTo.controller._baseRoute || '',
      route.pathname
    )
    return route.method === method && routePath.match(pathname)
  })
  return route ? {
    ...route.resolveTo,
    middlewares: route.middlewares
  } : false
}
