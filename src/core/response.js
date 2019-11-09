function Response (res) {
  this.res = res
}

// Helper functions to send a response with a particular HTTP status code.
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
    this.send(statuses[funcName], data, type)
  }
})

Response.prototype.header = function (key, value) {
  this.res.setHeader(key, value)

  return this
}

Response.prototype.send = function (status, data = null, type = null) {
  this.res.statusCode = status

  if (data) {
    const contentType = type || guessResponseType(data)
    this.header('Content-Type', contentType)

    this.res.write(
      contentType === 'application/json'
        ? JSON.stringify(data)
        : data
    )
  }

  this.res.end()
}

function guessResponseType (data) {
  if (typeof data === 'object' || data instanceof Array) {
    return 'application/json'
  }
  return 'text/plain'
}

module.exports = Response
