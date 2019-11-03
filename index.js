const Model = require('./src/core/model')
const Controller = require('./src/core/controller')
const Middleware = require('./src/core/middleware')
const Server = require('./src/core/server')
const Route = require('./src/core/route/proxies')

module.exports = {
  Model,
  Controller,
  Middleware,
  Server,
  Route
}
