/**
 * @param {Middleware[]} middlewares An array of middlewares to run.
 * @param {*} req The node server request object.
 * @param {*} res The node server response object.
 */
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

module.exports = MiddlewareHandler
