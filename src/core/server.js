const http = require('http')
const url = require('url')
const os = require('os')
const routeResolver = require('./route/resolver')
const Request = require('../helpers/request')
const Response = require('../helpers/response')

function MiddlewareHandler (middlewares, req, res, onFinished) {
  this.i = 0

  this.middlewares = middlewares
  this.req = req
  this.res = res
  this.onFinished = onFinished
}
MiddlewareHandler.prototype.next = function () {
  this.i++
  if (this.i >= this.middlewares.length) {
    this.onFinished()
  } else {
    this.run()
  }
}
MiddlewareHandler.prototype.run = function () {
  if (this.i < this.middlewares.length) {
    new this.middlewares[this.i]()
      .handle(
        this.req,
        this.res,
        this.next.bind(this)
      )
  }
}

function Server (config) {
  this.config = config
  this.server = null
}

Server.prototype._onHttpRequest = function (req, res) {
  const data = []

  req.on('data', (chunk) => {
    data.push(chunk)
  })

  req.on('end', () => {
    const { pathname } = url.parse(req.url)

    const resolver = routeResolver.resolve(req.method, pathname)
    if (resolver) {
      const request = new Request(req, data.toString())
      const response = new Response(res)
      // Run middlewares
      if (resolver.middlewares.length > 0) {
        new MiddlewareHandler(
          resolver.middlewares,
          request,
          response,
          () => {
            resolver.method(
              request,
              response
            )
          }
        ).run()
      } else {
        resolver.method(request, response)
      }
    } else {
      res.writeHead(404)
      res.write(`Unable to resolve ${req.method} ${pathname}`)
      res.end()
    }
  })
}

Server.prototype.start = function (callback) {
  this.server = http
    .createServer(this._onHttpRequest)
    .listen(this.config.port)

  callback({
    host: os.hostname(),
    port: this.server.address().port
  })
}

exports.Server = Server

process.on('SIGINT', () => {
  process.exit()
})
