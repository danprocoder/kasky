const column = require('../column')
const Column = require('../../core/column')

describe('Test functions to create a column', () => {
  it('should create string column', () => {
    const col = column.string('test_col')
    expect(col).toBeInstanceOf(Column)
  })

  it('should create boolean column', () => {
    const col = column.boolean('test_col')
    expect(col).toBeInstanceOf(Column)
  })

  it('should create integer column', () => {
    const col = column.integer('test_col')
    expect(col).toBeInstanceOf(Column)
  })

  it('should create increment column', () => {
    const col = column.increment('test_col')
    expect(col).toBeInstanceOf(Column)
  })

  it('should create float column', () => {
    const col = column.float('test_col', 2, 2)
    expect(col).toBeInstanceOf(Column)
  })

  it('should create a datetime column', () => {
    const col = column.datetime('birthdate')
    expect(col).toBeInstanceOf(Column)
  })
})
