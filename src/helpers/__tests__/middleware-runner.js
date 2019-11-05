const MiddlewareRunner = require('../middleware-runner')

const mockRequest = new function () {}()
const mockResponse = new function () {}()

const MiddlewareA = function () {}
MiddlewareA.prototype.handle = (req, res, next) => next()

const MiddlewareB = function () {}
MiddlewareB.prototype.handle = (req, res, next) => next()

const MiddlewareC = function () {}
MiddlewareC.prototype.handle = (req, res, next) => next()

const MiddlewareD = function () {}
MiddlewareD.prototype.handle = (req, res, next) => next()

describe('', () => {
  beforeAll(() => {
    jest.spyOn(MiddlewareA.prototype, 'handle')
    jest.spyOn(MiddlewareB.prototype, 'handle')
    jest.spyOn(MiddlewareC.prototype, 'handle')
    jest.spyOn(MiddlewareD.prototype, 'handle')
  })

  it('promise should resolve', () => {
    return expect(
      new MiddlewareRunner(
        [MiddlewareA, MiddlewareB, MiddlewareC, MiddlewareD],
        mockRequest,
        mockResponse
      ).run()
    ).resolves.toBeUndefined()
  })

  it('should run all middlewares', () => {
    const runner = new MiddlewareRunner(
      [MiddlewareA, MiddlewareB, MiddlewareC, MiddlewareD],
      mockRequest,
      mockResponse
    )

    return runner
      .run()
      .then(() => {
        expect(MiddlewareA.prototype.handle.mock.calls[0][0]).toEqual(mockRequest)
        expect(MiddlewareA.prototype.handle.mock.calls[0][1]).toEqual(mockResponse)
        expect(typeof MiddlewareA.prototype.handle.mock.calls[0][2]).toEqual('function')

        expect(MiddlewareB.prototype.handle.mock.calls[0][0]).toEqual(mockRequest)
        expect(MiddlewareB.prototype.handle.mock.calls[0][1]).toEqual(mockResponse)
        expect(typeof MiddlewareB.prototype.handle.mock.calls[0][2]).toEqual('function')

        expect(MiddlewareC.prototype.handle.mock.calls[0][0]).toEqual(mockRequest)
        expect(MiddlewareC.prototype.handle.mock.calls[0][1]).toEqual(mockResponse)
        expect(typeof MiddlewareC.prototype.handle.mock.calls[0][2]).toEqual('function')

        expect(MiddlewareD.prototype.handle.mock.calls[0][0]).toEqual(mockRequest)
        expect(MiddlewareD.prototype.handle.mock.calls[0][1]).toEqual(mockResponse)
        expect(typeof MiddlewareD.prototype.handle.mock.calls[0][2]).toEqual('function')
      })
  })
})
