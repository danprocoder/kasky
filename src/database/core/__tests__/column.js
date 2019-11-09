const Column = require('../column')
const types = require('../types')

describe('Test Column', () => {
  let column

  beforeAll(() => {
    column = new Column('test_col', types.boolean())
  })

  it('should return correct description', () => {
    expect(column.getDescription()).toEqual({
      name: 'test_col',
      type: types.boolean().getDescription(),
      nullable: true,
      autoIncrement: false
    })
  })

  it('should change nullable property', () => {
    expect(column.allowNull(false)).toEqual(column)

    expect(column.getDescription()).toEqual({
      name: 'test_col',
      type: types.boolean().getDescription(),
      nullable: false,
      autoIncrement: false
    })
  })

  it('should change nullable property to true if no argument is supplied', () => {
    expect(column.allowNull()).toEqual(column)

    expect(column.getDescription()).toEqual({
      name: 'test_col',
      type: types.boolean().getDescription(),
      nullable: true,
      autoIncrement: false
    })
  })

  it('should set autoIncrement property to true', () => {
    expect(column.autoIncrement()).toEqual(column)

    expect(column.getDescription()).toEqual({
      name: 'test_col',
      type: types.boolean().getDescription(),
      nullable: true,
      autoIncrement: true
    })
  })
})
