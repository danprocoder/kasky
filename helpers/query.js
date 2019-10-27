const pool = require('../database/connection');

module.exports = function(table) {
  return {
    run(sql, ...params) {
      console.log(sql);
      
      return pool.execute(sql, params)
        .then((result) => 
          ({
            getRows: () => result[0],
            getFirstRow: () => result[0][0]
          })
        );
    },

    insert(data) {
      if (data instanceof Array) {
        return this.insertMany(table, data);
      }

      const fields = [];
      const values = [];

      Object.keys(data).forEach(field => {
        fields.push(field);
        values.push(`${data[field]}`);
      });

      const escapedFields = fields.map(field => '`' + field + '`').join(', ');
      const questionMarks = values.map(() => '?').join(', ');
      return this.run('INSERT INTO `' + table + '`(' + escapedFields + ')VALUES(' + questionMarks + ')', ...values)
        .then(() => this.run('SELECT * FROM `' + table + '` WHERE id=LAST_INSERT_ID()'))
        .then(result => result.getFirstRow());
    }
  }
}
