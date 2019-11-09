const Response = require('../response')

const mockNodeResponse = {
  statusCode: null,
  setHeader: jest.fn(),
  write: jest.fn(),
  end: jest.fn()
}

describe('Test response object', () => {
  let res

  beforeAll(() => {
    res = new Response(mockNodeResponse)
    jest.spyOn(res, 'send')
  })

  afterEach(() => {
    mockNodeResponse.statusCode = null
    jest.clearAllMocks()
  })

  it('should send a response with the right status codes', () => {
    const helpers = [
      ['success', 200],
      ['created', 201],
      ['notFound', 404],
      ['badRequest', 400],
      ['unauthorized', 401],
      ['forbidden', 403],
      ['internalServerError', 500]
    ]
    helpers.forEach(helper => {
      const [fn, code] = helper

      expect(res[fn]('test_data', 'test_type')).toBeUndefined()
      expect(res.send).toHaveBeenCalledWith(code, 'test_data', 'test_type')
    })
  })

  it('should set status code and call end()', () => {
    res.send(200)

    expect(mockNodeResponse.statusCode).toEqual(200)
    expect(mockNodeResponse.setHeader).toHaveBeenCalledTimes(0)
    expect(mockNodeResponse.write).toHaveBeenCalledTimes(0)
    expect(mockNodeResponse.end).toHaveBeenCalledTimes(1)
  })

  it('should set status code, send data with type as json and call end()', () => {
    res.send(200, { message: 'hello' })

    expect(mockNodeResponse.statusCode).toEqual(200)
    expect(mockNodeResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json')
    expect(mockNodeResponse.write).toHaveBeenCalledWith(JSON.stringify({ message: 'hello' }))
    expect(mockNodeResponse.end).toHaveBeenCalledTimes(1)
  })

  it('should set status code, send data with type as text and call end()', () => {
    res.send(200, 'hello')

    expect(mockNodeResponse.statusCode).toEqual(200)
    expect(mockNodeResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain')
    expect(mockNodeResponse.write).toHaveBeenCalledWith('hello')
    expect(mockNodeResponse.end).toHaveBeenCalledTimes(1)
  })

  it('should set status code, send data with type as html and call end()', () => {
    res.send(200, 'hello', 'text/html')

    expect(mockNodeResponse.statusCode).toEqual(200)
    expect(mockNodeResponse.setHeader).toHaveBeenCalledWith('Content-Type', 'text/html')
    expect(mockNodeResponse.write).toHaveBeenCalledWith('hello')
    expect(mockNodeResponse.end).toHaveBeenCalledTimes(1)
  })
})
