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

  it('should return null if header was not sent by client', () => {
    expect(req.header('unknown-header')).toBeNull()
  })

  it('should return value for set url param', () => {
    expect(req.param('section')).toEqual('product')
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

  it('should return value of body parameter', () => {
    expect(req.body('name')).toEqual('Product Name')
  })

  it('should return null if body parameter was not sent', () => {
    expect(req.body('price')).toBeNull()
  })
})
