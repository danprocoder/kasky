const types = require('../types')

describe('Test types', () => {
  it('should return a string type description', () => {
    expect(types.string(255).getDescription()).toEqual({
      name: 'string',
      length: 255
    })
  })

  it('should return an integer type description', () => {
    expect(types.integer().getDescription()).toEqual({
      name: 'integer'
    })
  })

  it('should return a float type description', () => {
    expect(types.float(2, 2).getDescription()).toEqual({
      name: 'float',
      precision: 2,
      decimalPlace: 2
    })
  })

  it('should return a decimal type description', () => {
    expect(types.decimal(2, 2).getDescription()).toEqual({
      name: 'decimal',
      precision: 2,
      decimalPlace: 2
    })
  })

  it('should return a double type description', () => {
    expect(types.double(2, 2).getDescription()).toEqual({
      name: 'double',
      precision: 2,
      decimalPlace: 2
    })
  })

  it('should return a boolean type description', () => {
    expect(types.boolean().getDescription()).toEqual({
      name: 'boolean'
    })
  })
})
