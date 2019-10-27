const injector = require('./injector');

module.exports = function Controller(properties={}) {
  return function(target) {
    // Dependency injection here
    const { use } = properties;
    if (use) {
      Object.keys(use).forEach((key) => {
        target.prototype[key] = injector.resolve(use[key]);
      });
    }

    return target;
  }
}
