const url = require('url')

function Request (req, params, body) {
  const contentType = req.headers['content-type']

  this._headers = req.headers
  this._query = url.parse(req.url, true).query
  this._params = params
  this._body = this._parseRequestBody(contentType, body)
}

Request.prototype.header = function (key = null) {
  if (key === null) {
    return this._headers
  }

  return this._headers[key] || null
}

Request.prototype.query = function (key = null) {
  if (key === null) {
    return this._query
  }

  return this._query[key] || null
}

Request.prototype.param = function (key = null) {
  if (key === null) {
    return this._params
  }

  return this._params[key] || null
}

Request.prototype.body = function (key = null) {
  if (key === null) {
    return this._body
  }

  return typeof this._body === 'object'
    ? (this._body[key] || null)
    : null
}

Request.prototype._parseRequestBody = function (contentType, body) {
  switch (contentType) {
    case 'application/json':
      return this._handleJsonRequest(body)

    default:
      return body
  }
}

Request.prototype._handleJsonRequest = function (body) {
  return JSON.parse(body)
}

module.exports = Request
