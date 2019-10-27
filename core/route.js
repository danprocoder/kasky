const _routeConfig = [];

exports.Get = function(path, config={}) {
  return function(target, name, descriptor) {
    _routeConfig.push({
      method: 'GET',
      path: path.trim(),
      config,
      resolveTo: {
        controller: target,
        method: target[name].bind(target)
      },
      middlewares: config.middlewares || []
    });
    
    return {
      get() {
        return descriptor.value.bind(this);
      }
    };
  }
}

exports.Post = function(path, config={}) {
  return function(target, name, descriptor) {
    _routeConfig.push({
      method: 'POST',
      path: path.trim(),
      config,
      resolveTo: {
        controller: target,
        method: target[name].bind(target)
      },
      middlewares: config.middlewares || []
    });
    
    return {
      get() {
        const bound = descriptor.value.bind(this);
        Object.defineProperty(this, name, { value: bound });

        return bound;
      }
    };
  }
}

exports.Put = function(path, config={}) {
  return function(target, name, descriptor) {
    _routeConfig.push({
      method: 'PUT',
      path: path.trim(),
      config,
      resolveTo: {
        controller: target,
        method: target[name].bind(target)
      },
      middlewares: config.middlewares || []
    });

    return {
      get() {
        return descriptor.value.bind(this);
      }
    };
  }
}

exports.getRouteHandler = function(method, pathname) {
  let handler;

  _routeConfig.forEach(function(route) {
    if (route.method === method && route.path === pathname) {
      handler = route.resolveTo;
      handler.middlewares = route.middlewares;
    }
  });
  return handler;
}
