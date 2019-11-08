const schema = require('../index')
const column = require('../column')
const Table = require('../../core/table')

describe('Test schema object', () => {
  it('should return a table instance', () => {
    const table = schema.table('test_table').create([
      column.increment('id')
    ])
    expect(table).toBeInstanceOf(Table)
  })
})
