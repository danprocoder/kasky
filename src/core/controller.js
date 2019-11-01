const injector = require('./injector')

module.exports = function Controller (properties = {}) {
  return function (target) {
    Object.defineProperty(target.prototype, '_type', {
      get: () => 'controller',
      set: () => { throw new Error('Illegal Operation') }
    })

    const { baseRoute, use } = properties

    // Base route for all functions.
    if (baseRoute) {
      target.prototype._baseRoute = baseRoute
    }

    // Dependency injection here
    if (use) {
      Object.keys(use).forEach((key) => {
        target.prototype[key] = injector.resolve(use[key])
      })
    }

    return target
  }
}
