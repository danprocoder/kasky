import pool from '../connection';

export default class {
  query(query, values=null) {
    return pool.execute(query, values);
  }

  insert(table, data) {
    if (data instanceof Array) {
      return this.insertMany(table, data);
    }

    const fields = [];
    const values = [];

    Object.keys(data).forEach(field => {
      fields.push(field);
      values.push(`'${data[field]}'`);
    });

    const escapedFields = fields.map(field => '`' + field + '`').join(',');
    return this.query('INSERT INTO `' + table + '`(' + escapedFields + ')VALUES(' + values.join(',') + ')');
  }

  insertMany(table, data) {
    const fields = Object.keys(data[0]);
    const values = [];

    data.forEach((item) => {
      let valueItems = [];

      fields.forEach(key => {
        valueItems.push(`'${item[key]}'`);
      });

      values.push('(' + valueItems.join(',') + ')');
    });
    
    const escapedFields = fields.map(field => '`' + field + '`').join(',');
    const query = `INSERT INTO \`${table}\`(${escapedFields})VALUES${values.join(',')}`
    return this.query(query);
  }
}
