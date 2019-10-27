const http = require('http');
const url = require('url');
const appLoader = require('./app-loader');
const route = require('./route');
const Request = require('../helpers/request');
const Response = require('../helpers/response');

function MiddlewareHandler(middlewares, req, res, onFinished) {
  this.i = 0;

  this.middlewares = middlewares;
  this.req = req;
  this.res = res;
  this.onFinished = onFinished;
};
MiddlewareHandler.prototype.next = function() {
  this.i++;
  if (this.i >= this.middlewares.length) {
    this.onFinished();
  } else {
    this.run();
  }
};
MiddlewareHandler.prototype.run = function() {
  if (this.i < this.middlewares.length) {
    new this.middlewares[this.i]()
      .handle(
        this.req,
        this.res,
        this.next.bind(this)
      );
  }
}

function Server(config) {
  let server;

  return {
    _onHttpRequest(req, res) {
      let data = [];

      req.on('data', chunk => {
        data.push(chunk);
      });

      req.on('end', () => {
        const { pathname, query } = url.parse(req.url);
  
        const resolver = route.getRouteHandler(req.method, pathname);
        if (resolver) {
          const request = new Request(req, data.toString());
          const response = new Response(res);
          // Run middlewares
          if (resolver.middlewares.length > 0) {
            new MiddlewareHandler(
              resolver.middlewares,
              request,
              response,
              function() {
                resolver.method(
                  request,
                  response
                );
              }
            ).run();
          } else {
            resolver.method(request, response);
          }
        } else {
          res.writeHead(404);
          res.write(`Unable to resolve ${req.method} ${pathname}`);
          res.end();
        }
      });
    },
 
    start(callback) {
      appLoader.loadApp();
      
      server = http.createServer(this._onHttpRequest)
        .listen(config.port);

      callback();
    }
  };
};
module.exports = Server;

process.on('SIGINT', function() {
  process.exit();
});
