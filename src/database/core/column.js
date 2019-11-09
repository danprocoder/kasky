function Column (name, type) {
  this._type = type
  this._name = name
  this._allowNull = true
  this._autoIncrement = false
}

Column.prototype.allowNull = function (allow = true) {
  this._allowNull = allow
  return this
}

Column.prototype.autoIncrement = function () {
  this._autoIncrement = true
  return this
}

Column.prototype.getDescription = function () {
  return {
    name: this._name,
    type: this._type.getDescription(),
    nullable: this._allowNull,
    autoIncrement: this._autoIncrement
  }
}

module.exports = Column
