const db = require('../helpers/query')

function Model (options) {
  return function (target, name, descriptor) {
    if (options.table) {
      target.prototype.table = options.table
    }

    target.prototype.db = db(options.table)

    return descriptor
  }
}
module.exports = Model
