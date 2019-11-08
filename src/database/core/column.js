function Column (name, type) {
  this._type = type
  this._name = name
  this._allowNull = true
  this._unique = false
}

Column.prototype.allowNull = function (allow = true) {
  this._allowNull = allow
  return this
}

Column.prototype.unique = function (unique = true) {
  this._unique = unique
  return this
}

Column.prototype.getDescription = function () {
  return {
    name: this._name,
    type: this._type.getDescription(),
    nullable: this._allowNull,
    unique: this._unique
  }
}

module.exports = Column
