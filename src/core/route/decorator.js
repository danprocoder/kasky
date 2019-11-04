const register = require('./register')

/**
 *
 * @param {array} params
 */
function parseParams (params) {
  let path = ''
  let config = {}

  if (params.length > 1) {
    // First parameter is expected to be a string and
    // second parameter is expected to be an object.
    [path, config] = params
  } else if (params.length === 1) {
    // Parameter is assumed to be a route if it is a string or a
    // config object is it is an object.
    if (typeof params[0] === 'string' || params[0] instanceof Array) {
      path = params[0]
    } else if (typeof params[0] === 'object') {
      config = params[0]
    }
  }

  return { path, config }
}

/**
 *
 * @param {string} method HTTP request method. One of GET, POST, PUT, PATCH or DELETE.
 * @param {array} args
 */
function getDecorator (method, ...args) {
  const { path, config } = parseParams(args)

  return function (target, name, descriptor) {
    if (path instanceof Array) {
      path.forEach(path =>
        register.register(method, path, target, name, config)
      )
    } else {
      register.register(method, path, target, name, config)
    }

    // Return custom descriptor.
    return {
      get () {
        return descriptor.value.bind(this)
      }
    }
  }
}

exports.getDecorator = getDecorator
