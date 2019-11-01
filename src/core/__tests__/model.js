const modelDecorator = require('../model')

jest.mock('../../helpers/query', () => () => {})

describe('Test @Model() decorator', () => {
  let Model

  beforeEach(() => {
    Model = function () {}
  })

  afterAll(() => jest.restoreAllMocks())

  it('It should set _type property to model', () => {
    const Decorated = modelDecorator({ table: 'users_blogs' })(Model)
    expect(new Decorated()._type).toEqual('model')
  })

  it('It should throw an error if user attempts to change _type property', () => {
    const Decorated = modelDecorator({ table: 'users_blogs' })(Model)
    expect(() => {
      // Attempt to change _type to a 'controller'
      new Decorated()._type = 'controller'
    }).toThrow()
  })

  it('It should set table property', () => {
    const Decorated = modelDecorator({ table: 'users_blogs' })(Model)
    expect(new Decorated().table).toEqual('users_blogs')
  })

  it('It should throw an error if table property is not set', () => {
    expect(() =>
      modelDecorator({})(Model)
    ).toThrow()
  })
})
