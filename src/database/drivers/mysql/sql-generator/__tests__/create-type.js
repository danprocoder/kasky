const type = require('../../../../core/types')
const createTypeSql = require('../create-type')

describe('Test function to return sql data types', () => {
  it('should return VARCHAR datatype', () => {
    expect(createTypeSql(type.string(255).getDescription())).toEqual('VARCHAR(255)')
  })

  it('should return TEXT datatype', () => {
    expect(createTypeSql(type.string(1001).getDescription())).toEqual('TEXT')
  })

  it('should return FLOAT(?, ?) datatype', () => {
    expect(createTypeSql(type.float(2, 2).getDescription())).toEqual('FLOAT(2, 2)')
  })

  it('should return DOUBLE(?, ?) datatype', () => {
    expect(createTypeSql(type.double(2, 2).getDescription())).toEqual('DOUBLE(2, 2)')
  })

  it('should return DECIMAL(?, ?) datatype', () => {
    expect(createTypeSql(type.decimal(2, 2).getDescription())).toEqual('DECIMAL(2, 2)')
  })

  it('should return INT datatype', () => {
    expect(createTypeSql(type.integer().getDescription())).toEqual('INT')
  })
})
