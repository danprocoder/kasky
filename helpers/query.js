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
      console.log('Inserting', data);
      if (data instanceof Array) {
        return this._insertMany(data);
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
    },

    _insertMany(data) {
      const fields = Object.keys(data[0]);
      const values = [];

      data.forEach((item) => {
        let valueItems = [];

        fields.forEach(key => {
          valueItems.push(`${pool.escape(item[key])}`);
        });
        
        values.push('(' + valueItems.join(',') + ')');
      });
      
      const escapedFields = fields.map(field => '`' + field + '`').join(',');
      const query = `INSERT INTO \`${table}\`(${escapedFields})VALUES${values.join(',')}`
      return this.run(query);
    },

    escape(str) {
      return pool.escape(str);
    }
  }
}
