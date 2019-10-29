const injector = require('./injector');

module.exports = function Middleware(properties={}) {
  return function(target, name, descriptor) {
    // Dependency injection here
    const { use } = properties;
    if (use) {
      Object.keys(use).forEach((key) => {
        target.prototype[key] = injector.resolve(use[key]);
      });
    }

    return descriptor;
  }
}
