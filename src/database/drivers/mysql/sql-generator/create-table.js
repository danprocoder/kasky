const createColumnSql = require('./create-column')

module.exports = function (description) {
  let sql = 'CREATE TABLE IF NOT EXISTS `'.concat(description.name, '`')

  const fields = []
  description.columns.forEach(col => {
    fields.push(createColumnSql(col))
  })

  // Unique keys
  if (description.unique.length > 0) {
    const unique = description.unique.map(key => `\`${key}\``).join(', ')
    fields.push(`UNIQUE (${unique})`)
  }

  // Primary keys
  if (description.primaryKeys.length > 0) {
    const pk = description.primaryKeys.map(key => `\`${key}\``).join(', ')
    fields.push(`PRIMARY KEY (${pk})`)
  }

  sql += '(' + fields.join(', ') + ')'
  return sql
}
