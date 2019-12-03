const { Server } = require('../server')

const createMockRequest = (method, url) => ({
  method,
  url,
  on: () => 1
})

const createMockResponse = () => ({
  _header: {},
  _status: 0,

  setHeader (k, v) {
    this._header[k] = v
  },

  writeHead (status) {
    this._status = status
  },

  end: jest.fn()
})

describe('Test server', () => {
  describe('Test preflight requests', () => {
    it('should return 200 if a request with OPTIONS was sent', () => {
      const req = createMockRequest('OPTIONS', 'some_url')
      const res = createMockResponse()

      Server.prototype._onHttpRequest(req, res)

      expect(res._header).toMatchObject({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE'
      })
      expect(res._status).toEqual(200)
      expect(res.end).toHaveBeenCalledTimes(1)
    })
  })
})
