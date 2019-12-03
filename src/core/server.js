const http = require('http')
const url = require('url')
const os = require('os')
const routeResolver = require('./route/resolver')
const Request = require('./request')
const Response = require('./response')
const MiddlewareHandler = require('../helpers/middleware-runner')

function Server (config) {
  this.config = config
  this.server = null
}

Server.prototype._onHttpRequest = function (req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()

    return
  }

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
