const createTypeSql = require('./create-type')

module.exports = function (description) {
  const i = [
    `\`${description.name}\``,
    createTypeSql(description.type)
  ]
  if (description.nullable === false) {
    i.push('NOT NULL')
  }
  if (description.autoIncrement === true) {
    i.push('AUTO_INCREMENT')
  }
  return i.join(' ')
}
