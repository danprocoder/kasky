module.exports = function (description) {
  let type

  switch (description.name) {
    case 'string':
      if (description.length > 1000) {
        type = 'TEXT'
      } else {
        type = `VARCHAR(${description.length})`
      }

      break

    case 'integer':
      type = 'INT'

      break

    case 'float':
      type = `FLOAT(${description.precision}, ${description.decimalPlace})`

      break

    case 'double':
      type = `DOUBLE(${description.precision}, ${description.decimalPlace})`

      break

    case 'decimal':
      type = `DECIMAL(${description.precision}, ${description.decimalPlace})`

      break

    case 'datetime':
      type = 'DATETIME'

      break
  }

  return type
}
