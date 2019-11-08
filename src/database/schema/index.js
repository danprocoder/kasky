const Table = require('../core/table')

module.exports = {
  table (name) {
    return {
      /**
       * @param {Column[]} columns The columns for the table.
       *
       * @returns {Table} Returns a table instance.
       */
      create (columns) {
        return new Table(name, columns)
      },

      drop () {}
    }
  }
}
