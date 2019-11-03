const decorator = require('../route/decorator')

/**
 * Configures a route for requests with the HTTP GET method.
 */
exports.Get = function (...args) {
  return decorator.getDecorator('GET', ...args)
}

/**
 * Configures a route for requests with the HTTP POST method.
 */
exports.Post = function (...args) {
  return decorator.getDecorator('POST', ...args)
}

/**
 * Configures a route for requests with the HTTP PUT method.
 */
exports.Put = function (...args) {
  return decorator.getDecorator('PUT', ...args)
}

/**
 * Configures a route for requests with the HTTP PATCH method.
 */
exports.Patch = function (...args) {
  return decorator.getDecorator('PATCH', ...args)
}

/**
 * Configures a route for request with the HTTP DELETE method.
 */
exports.Delete = function (...args) {
  return decorator.getDecorator('DELETE', ...args)
}
