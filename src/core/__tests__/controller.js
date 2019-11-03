const controllerDecorator = require('../controller')

describe('Test @Controller() Decorator', () => {
  let Controller

  beforeEach(() => {
    Controller = function () {}
  })

  it('should set _baseRoute property of controller instance', () => {
    const Decorated = controllerDecorator({ baseRoute: '/api/v1.0' })(Controller)
    expect(new Decorated()._baseRoute).toEqual('/api/v1.0')
  })

  it('should inject ModelA and ModelB', () => {
    function ModelA () {}
    function ModelB () {}

    const decorated = new (controllerDecorator({
      use: { modelA: ModelA, modelB: ModelB }
    })(Controller))()
    expect(decorated._baseRoute).toBeFalsy()
    expect(decorated.modelA).toBeInstanceOf(ModelA)
    expect(decorated.modelB).toBeInstanceOf(ModelB)
  })
})
