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
  increment: (name) => new Column(name, type.integer()).allowNull(false)
}
