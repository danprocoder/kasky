export default {
  create (tableName, fields) {
    let primaryKeyDef = null;
    let columnDefs = [];

    Object.keys(fields).forEach(colName => {
      const { dataType, nullable, autoIncrement, primaryKey, defaultValue } = fields[colName];

      let col = `\`${colName}\` ${dataType}`;
      if (nullable === false) {
        col += ' NOT NULL';
      }

      if (defaultValue) {
        col += ` DEFAULT '${defaultValue}'`
      }

      if (autoIncrement === true) {
        col += ' AUTO_INCREMENT';
      }
      if (primaryKey === true) {
        primaryKeyDef = 'PRIMARY KEY (`' + colName + '`)';
      }

      columnDefs.push(col);
    });

    let query = 'CREATE TABLE IF NOT EXISTS `' + tableName +  '`(' + columnDefs.join(',');
    if (primaryKeyDef) {
      query += `,${primaryKeyDef}`
    }
    query += ')';

    return {
      table: tableName,
      query
    };
  },

  drop (tableName) {
    return {
      table: tableName,
      query: 'DROP TABLE IF EXISTS `' + tableName + '`'
    };
  }
}
