function Response (res) {
  this.res = res
}

// Statuses
const statuses = {
  success: 200,
  created: 201,
  notFound: 404,
  forbidden: 400,
  unauthorized: 401,
  internalServerError: 500
}
Object.keys(statuses).forEach((funcName) => {
  Response.prototype[funcName] = function (data = null, type = null) {
    this.res.statusCode = statuses[funcName]

    this.header(
      'Content-type',
      type || this._guessResponseType(data)
    )

    if (data) {
      this._send(data)
    }
  }
})

Response.prototype._guessResponseType = function (data) {
  if (typeof data === 'object' || data instanceof Array) {
    return 'application/json'
  }
  return 'text/plain'
}

Response.prototype.header = function (key, value) {
  this.res.setHeader(key, value)

  return this
}

Response.prototype._send = function (data) {
  this.res.write(JSON.stringify(data))
  this.res.end()
}

module.exports = Response
