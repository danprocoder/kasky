function Type (description) {
  this.description = description
}

Type.prototype.getDescription = function () {
  return this.description
}

function string (length) {
  return new Type({
    name: 'string',
    length
  })
}

function integer () {
  return new Type({
    name: 'integer'
  })
}

function float (precision, decimalPlace) {
  return new Type({
    name: 'float',
    precision,
    decimalPlace
  })
}

function decimal (precision, decimalPlace) {
  return new Type({
    name: 'decimal',
    precision,
    decimalPlace
  })
}

function double (precision, decimalPlace) {
  return new Type({
    name: 'double',
    precision,
    decimalPlace
  })
}

function boolean () {
  return new Type({
    name: 'boolean'
  })
}

module.exports = {
  string,
  integer,
  float,
  decimal,
  double,
  boolean
}
