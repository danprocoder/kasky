module.exports = {
  _routes: [],

  /**
   * Registers a new route
   *
   * @param {string} method The HTTP method
   * @param {string} pathname The url path
   * @param {prototype} controller The prototype of the controller constructor
   * @param {string} methodName The name of the method
   * @param {object} config The configuration object.
   */
  register: function (
    method,
    pathname,
    controller,
    methodName,
    config = {}
  ) {
    const route = {
      method,
      pathname,
      resolveTo: {
        controller,
        method: controller[methodName]
      },
      middlewares: config.middlewares || []
    }
    this._routes.push(route)
    return route
  }
}
