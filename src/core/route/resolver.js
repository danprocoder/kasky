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
  if (route) {
    const { controller, methodName } = route.resolveTo
    return {
      controller: controller,
      method: controller[methodName],
      middlewares: route.middlewares
    }
  }

  return false
}
