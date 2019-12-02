const jwt = require('jsonwebtoken')
const Request = require('../request')

function createMockNodeRequest (headers, url) {
  return {
    headers, url
  }
}

describe('Test the request object', () => {
  let req

  beforeAll(() => {
    const nodeReq = createMockNodeRequest(
      {
        'content-type': 'application/json'
      },
      'http://domain.net/product?action=update&id=5'
    )
    req = new Request(nodeReq, { section: 'product' }, '{"name":"Product Name"}')
  })

  it('should return value for content-type header', () => {
    expect(req.header('content-type')).toEqual('application/json')
  })

  it('should return the header object', () => {
    expect(req.header()).toEqual({ 'content-type': 'application/json' })
  })

  it('should return null if header was not sent by client', () => {
    expect(req.header('unknown-header')).toBeNull()
  })

  it('should return value for set url param', () => {
    expect(req.param('section')).toEqual('product')
  })

  it('should return the param object', () => {
    expect(req.param()).toEqual({ section: 'product' })
  })

  it('should return null if param was not sent', () => {
    expect(req.param('unknown-param')).toBeNull()
  })

  it('should return value for sent query', () => {
    expect(req.query('action')).toEqual('update')
    expect(req.query('id')).toEqual('5')
  })

  it('should return null if query was not sent', () => {
    expect(req.query('name')).toBeNull()
  })

  it('should return the query object', () => {
    expect(req.query()).toEqual({
      action: 'update',
      id: '5'
    })
  })

  it('should return value of body parameter', () => {
    expect(req.body('name')).toEqual('Product Name')
  })

  it('should return the body object', () => {
    expect(req.body()).toEqual({ name: 'Product Name' })
  })

  it('should return null if body parameter was not sent', () => {
    expect(req.body('price')).toBeNull()
  })

  describe('Test authBearer() method', () => {
    it('should return null if no authorization header was set', () => {
      const nodeReq = createMockNodeRequest({}, 'some/url/path')
      const req = new Request(nodeReq, {}, {})

      expect(req.authBearer()).toBeNull()
    })

    it('should return null if the format for the authorization header is incorrect', () => {
      const nodeReq = createMockNodeRequest({
        authorization: 'user_authorization_token'
      }, 'some/url/path')
      const req = new Request(nodeReq, {}, {})

      expect(req.authBearer()).toBeNull()
    })

    it('should return the authorization bearer token', () => {
      const nodeReq = createMockNodeRequest({
        authorization: 'Bearer user_authorization_token'
      }, 'some/url/path')
      const req = new Request(nodeReq, {}, {})

      expect(req.authBearer()).toEqual('user_authorization_token')
    })
  })

  describe('Test authBearerJwtDecode() method', () => {
    it('should return null if no bearer token was set', () => {
      const nodeReq = createMockNodeRequest({}, 'some/url/path')
      const req = new Request(nodeReq, {}, {})

      expect(req.authBearerJwtDecode('fake_secret')).toBeNull()
    })

    it('should return null if jwt token is invalid', () => {
      const nodeReq = createMockNodeRequest({
        authorization: 'Bearer fake_token'
      }, 'some/url/path')
      const req = new Request(nodeReq, {}, {})

      expect(req.authBearerJwtDecode('fake_secret')).toBeNull()
    })

    it('should return the decoded jwt payload', () => {
      const jwtSecret = 'some_secret_key'
      const token = jwt.sign({ data: 'user_data' }, jwtSecret)

      const nodeReq = createMockNodeRequest({
        authorization: `Bearer ${token}`
      }, 'some/url/path')
      const req = new Request(nodeReq, {}, {})

      expect(
        req.authBearerJwtDecode(jwtSecret)
      ).toMatchObject({ data: 'user_data' })
    })
  })

  describe('Test headerJwtDecode() method', () => {
    it('should return null if the header was not set', () => {
      const nodeReq = createMockNodeRequest({}, '')
      const req = new Request(nodeReq, {}, {})

      expect(req.headerJwtDecode('my-token', 'some-secret')).toBeNull()
    })

    it('should return null if the token is invalid', () => {
      const nodeReq = createMockNodeRequest({ 'my-token': 'invalid_jwt_token' }, '')
      const req = new Request(nodeReq, {}, {})

      expect(req.headerJwtDecode('my-token', 'some-secret')).toBeNull()
    })

    it('should return the decoded jwt payload', () => {
      const jwtSecret = 'some_secret_key'
      const token = jwt.sign({ data: 'user_data' }, jwtSecret)

      const nodeReq = createMockNodeRequest({ 'my-token': token }, '')
      const req = new Request(nodeReq, {}, {})

      expect(
        req.headerJwtDecode('my-token', 'some_secret_key')
      ).toMatchObject({ data: 'user_data' })
    })
  })
})
