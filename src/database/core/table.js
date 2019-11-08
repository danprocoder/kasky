function Table (name, columns) {
  this._description = {
    name,
    columns: columns.map(col => col.getDescription()),
    collate: null,
    primaryKeys: []
  }
}

Table.prototype.collate = function (collate) {
  this._description.collate = collate
  return this
}

Table.prototype.primaryKeys = function (columnNames) {
  this._description.primaryKeys = columnNames
  return this
}

Table.prototype.getDescription = function () {
  return this._description
}

module.exports = Table
