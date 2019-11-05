const http = require('http')
const url = require('url')
const os = require('os')
const routeResolver = require('./route/resolver')
const Request = require('../helpers/request')
const Response = require('../helpers/response')

function MiddlewareHandler (middlewares, req, res) {
  this.i = 0

  this.middlewares = middlewares
  this.req = req
  this.res = res
  this._promise = { resolve: null }
}

MiddlewareHandler.prototype.next = function () {
  this.i++
  if (this.i >= this.middlewares.length) {
    this._promise.resolve()
  } else {
    this._handle()
  }
}

MiddlewareHandler.prototype._handle = function () {
  if (this.i < this.middlewares.length) {
    new this.middlewares[this.i]()
      .handle(
        this.req,
        this.res,
        this.next.bind(this)
      )
  }
}

MiddlewareHandler.prototype.run = function () {
  const promise = new Promise(resolve => {
    this._promise.resolve = resolve
  })

  this._handle()

  return promise
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
      const request = new Request(req, resolver.url.params, data.toString())
      const response = new Response(res)

      // Run middlewares
      if (resolver.middlewares.length > 0) {
        new MiddlewareHandler(resolver.middlewares, request, response)
          .run()
          .then(() => {
            resolver.method(request, response)
          })
      } else {
        resolver.method(request, response)
      }
    } else {
      console.log('Unable to resolve', req.method, pathname)
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
