const modelDecorator = require('../model')

jest.mock('../../helpers/query', () => () => {})

describe('Test @Model() decorator', () => {
  let Model

  beforeEach(() => {
    Model = function () {}
  })

  afterAll(() => jest.restoreAllMocks())

  it('should set table property', () => {
    const Decorated = modelDecorator({ table: 'users_blogs' })(Model)
    expect(new Decorated().table).toEqual('users_blogs')
  })

  it('should throw an error if table property is not set', () => {
    expect(() =>
      modelDecorator({})(Model)
    ).toThrow()
  })
})
