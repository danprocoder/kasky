const Table = require('../table')
const column = require('../../schema/column')

describe('Test Table', () => {
  let table
  let fields

  beforeAll(() => {
    fields = [
      column.increment('id'),
      column.string('firstname'),
      column.string('lastname')
    ]
    table = new Table('users', fields)
  })

  it('should return the correct description of the table', () => {
    expect(table.getDescription()).toEqual({
      name: 'users',
      columns: fields.map(col => col.getDescription()),
      collate: null,
      primaryKeys: []
    })
  })

  it('should change the collate type', () => {
    expect(table.collate('utf-8')).toEqual(table)

    expect(table.getDescription()).toEqual({
      name: 'users',
      columns: fields.map(col => col.getDescription()),
      collate: 'utf-8',
      primaryKeys: []
    })
  })

  it('should set the primaryKeys', () => {
    expect(table.primaryKeys(['id'])).toEqual(table)

    expect(table.getDescription()).toEqual({
      name: 'users',
      columns: fields.map(col => col.getDescription()),
      collate: 'utf-8',
      primaryKeys: ['id']
    })
  })
})
