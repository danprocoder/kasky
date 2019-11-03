const middlewareDecorator = require('../middleware')

describe('Test the @Middleware() Decorator', () => {
  it('should throw an error if the middleware doesn\'t have a handle() method', () => {
    function TestMiddleware () {}
    expect(() =>
      middlewareDecorator()(TestMiddleware)
    ).toThrow('Middleware should contain a handle() method')
  })

  it('should not throw an error if the middleware has a handle() method', () => {
    function TestMiddleware () {}
    TestMiddleware.prototype.handle = function (req, res, next) {}

    expect(() =>
      middlewareDecorator()(TestMiddleware)
    ).not.toThrow()
  })

  it('should inject models', () => {
    function TestMiddleware () {}
    TestMiddleware.prototype.handle = function (req, res, next) {}

    // Models
    function ModelA () {}
    function ModelB () {}

    // Decorate the middleware
    middlewareDecorator({
      use: {
        modelA: ModelA,
        modelB: ModelB
      }
    })(TestMiddleware)

    const middleware = new TestMiddleware()
    expect(middleware.modelA).toBeInstanceOf(ModelA)
    expect(middleware.modelB).toBeInstanceOf(ModelB)
  })
})
