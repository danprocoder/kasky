const pool = require('../database/connection')
const highlight = require('cli-highlight').highlight

module.exports = function (table) {
  return {
    run (sql, ...params) {
      console.log(highlight(sql, { language: 'sql', ignoreIllegals: true }))

      return pool.getDatabase()
        .then(connection => {
          return connection.execute(sql, params)
            .then(result => {
              return { connection, result }
            })
        })
        .then(payload => {
          payload.connection.release()

          return {
            getRows: () => payload.result[0],
            getFirstRow: () => payload.result[0][0]
          }
        })
    },

    insert (data) {
      if (data instanceof Array) {
        return this._insertMany(data)
      }

      const fields = []
      const values = []

      Object.keys(data).forEach((field) => {
        fields.push(field)
        values.push(`${data[field]}`)
      })

      const escapedFields = fields.map((field) => `\`${field}\``).join(', ')
      const questionMarks = values.map(() => '?').join(', ')

      return pool.getDatabase()
        .then(connection =>
          connection.execute(`INSERT INTO \`${table}\`(${escapedFields})VALUES(${questionMarks})`, values)
            .then(() => connection)
        )
        .then(connection =>
          connection.execute(`SELECT * FROM \`${table}\` WHERE id=LAST_INSERT_ID()`)
            .then(result => {
              connection.release()

              return result[0][0]
            })
        )
    },

    _insertMany (data) {
      const fields = Object.keys(data[0])
      const values = []

      data.forEach((item) => {
        const valueItems = []

        fields.forEach((key) => {
          valueItems.push(`${pool.escape(item[key])}`)
        })

        values.push(`(${valueItems.join(',')})`)
      })

      const escapedFields = fields.map((field) => `\`${field}\``).join(',')
      const query = `INSERT INTO \`${table}\`(${escapedFields})VALUES${values.join(',')}`
      return this.run(query)
    },

    escape (str) {
      return pool.escape(str)
    }
  }
}
