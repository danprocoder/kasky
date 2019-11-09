const column = require('../../../../schema/column')
const getColumnSQL = require('../create-column')

describe('Test function to generate SQL for a column', () => {
  it('should return correct sql', () => {
    const col = column.integer('quantity')
    expect(getColumnSQL(col.getDescription())).toEqual('`quantity` INT')
  })

  it('should return sql with null values not allowed', () => {
    const col = column.integer('quantity').allowNull(false)
    expect(getColumnSQL(col.getDescription())).toEqual('`quantity` INT NOT NULL')
  })

  it('should return sql with null values not allowed and auto_increment', () => {
    const col = column.integer('quantity').allowNull(false).autoIncrement()
    expect(getColumnSQL(col.getDescription())).toEqual('`quantity` INT NOT NULL AUTO_INCREMENT')
  })
})
