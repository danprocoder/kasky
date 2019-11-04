const url = require('url')

function Request (req, params, body) {
  const contentType = req.headers['content-type']

  this.headers = req.headers
  this.query = url.parse(req.url, true).query
  this.params = params
  this.body = this._parseRequestBody(contentType, body)
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
