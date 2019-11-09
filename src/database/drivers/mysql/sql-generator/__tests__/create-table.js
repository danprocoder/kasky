const createTable = require('../create-table')
const schema = require('../../../../schema/index')
const column = require('../../../../schema/column')

describe('Test function to generate sql to create table', () => {
  it('Test case #1', () => {
    const table = schema.table('products').create([
      column.increment('id'),
      column.string('name'),
      column.integer('quantity'),
      column.double('price', 2, 2)
    ])
      .primaryKeys(['id'])

    expect(createTable(table.getDescription())).toEqual(
      'CREATE TABLE IF NOT EXISTS `products`(`id` INT NOT NULL AUTO_INCREMENT, `name` VARCHAR(255), `quantity` INT, `price` DOUBLE(2, 2), PRIMARY KEY (`id`))'
    )
  })

  it('Test case #2 (all fields not nullable)', () => {
    const table = schema.table('products')
      .create([
        column.increment('id'),
        column.string('name').allowNull(false),
        column.integer('quantity').allowNull(false),
        column.double('price', 2, 2).allowNull(false)
      ])
      .primaryKeys(['id'])

    expect(createTable(table.getDescription())).toEqual(
      'CREATE TABLE IF NOT EXISTS `products`(`id` INT NOT NULL AUTO_INCREMENT, `name` VARCHAR(255) NOT NULL, `quantity` INT NOT NULL, `price` DOUBLE(2, 2) NOT NULL, PRIMARY KEY (`id`))'
    )
  })

  it('Test case #3 (with composite key)', () => {
    const table = schema.table('test_table')
      .create([
        column.increment('id'),
        column.string('email').allowNull(false)
      ])
      .primaryKeys(['id', 'email'])

    expect(createTable(table.getDescription())).toEqual(
      'CREATE TABLE IF NOT EXISTS `test_table`(`id` INT NOT NULL AUTO_INCREMENT, `email` VARCHAR(255) NOT NULL, PRIMARY KEY (`id`, `email`))'
    )
  })

  it('Test case #4 (without primary key)', () => {
    const table = schema.table('test_table').create([
      column.string('email').allowNull(false)
    ])

    expect(createTable(table.getDescription())).toEqual(
      'CREATE TABLE IF NOT EXISTS `test_table`(`email` VARCHAR(255) NOT NULL)'
    )
  })

  it('Test case #5 (with unique key)', () => {
    const table = schema.table('test_table')
      .create([
        column.increment('id'),
        column.string('email').allowNull(false)
      ])
      .unique(['email'])
      .primaryKeys(['id'])

    expect(createTable(table.getDescription())).toEqual(
      'CREATE TABLE IF NOT EXISTS `test_table`(`id` INT NOT NULL AUTO_INCREMENT, `email` VARCHAR(255) NOT NULL, UNIQUE (`email`), PRIMARY KEY (`id`))'
    )
  })
})
