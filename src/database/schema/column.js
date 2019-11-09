const type = require('../core/types')
const Column = require('../core/column')

module.exports = {
  /**
   * Helper function to create a string column.
   *
   * @param {string} name The name of the column.
   */
  string: (name, length = 255) => new Column(name, type.string(length)),

  /**
   * Helper function to create a boolean column.
   *
   * @param {string} name The name of the column.
   */
  boolean: name => new Column(name, type.boolean()),

  /**
   * Helper function to create an integer column.
   *
   * @param {string} name The name of the column.
   */
  integer: (name) => new Column(name, type.integer()),

  /**
   * Helper function to create an integer field that increases by 1 each time you
   * insert a new row.
   *
   * @param {string} name The name of the column.
   */
  increment: (name) => new Column(name, type.integer()).allowNull(false).autoIncrement(),

  /**
   * Helper function to create a field to hold data with 'double' data type.
   *
   * @param {string} name The name of the field.
   * @param {precision} number The precision.
   * @param {decimalPlace} number The number of decimal places.
   *
   * @return {Column} Returns a column object.
   */
  double: (name, precision, decimalPlace) => new Column(name, type.double(precision, decimalPlace))
}
