const _routeConfig = []

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
    if (typeof params[0] === 'string') {
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
function getDecorator (method, args) {
  const { path, config } = parseParams(args)

  return function (target, name, descriptor) {
    _routeConfig.push({
      method,
      path,
      config,
      resolveTo: {
        controller: target,
        method: target[name].bind(target)
      },
      middlewares: config.middlewares || []
    })

    // Return custom descriptor.
    return {
      get () {
        return descriptor.value.bind(this)
      }
    }
  }
}

/**
 * Configures a route for requests with the HTTP GET method.
 */
exports.Get = function (...args) {
  return getDecorator('GET', args)
}

/**
 * Configures a route for requests with the HTTP POST method.
 */
exports.Post = function (...args) {
  return getDecorator('POST', args)
}

/**
 * Configures a route for requests with the HTTP PUT method.
 */
exports.Put = function (...args) {
  return getDecorator('PUT', args)
}

exports.getRouteHandler = function (method, pathname) {
  function routesMatch (routeA, routeB) {
    return routeA === routeB
  }

  function getRoutePath (route) {
    let { path } = route

    const { controller } = route.resolveTo
    if (controller._baseRoute) {
      path = controller._baseRoute + path
    }
    return path
  }

  let handler
  _routeConfig.forEach((route) => {
    const currentHandler = route.resolveTo

    if (route.method === method && routesMatch(getRoutePath(route), pathname)) {
      handler = currentHandler
      handler.middlewares = route.middlewares
    }
  })
  return handler
}
