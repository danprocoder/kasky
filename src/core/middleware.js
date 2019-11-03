const injector = require('./injector')

module.exports = function Middleware (properties = {}) {
  return function (target) {
    // All middlewares must have a handle method
    if (typeof target.prototype.handle !== 'function') {
      throw new Error('Middleware should contain a handle() method')
    }

    // Dependency injection here
    const { use } = properties
    if (use) {
      Object.keys(use).forEach((key) => {
        target.prototype[key] = injector.resolve(use[key])
      })
    }

    return target
  }
}
