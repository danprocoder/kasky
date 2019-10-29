const mysql = require('mysql2')
const config = require('../core/config')
const env = require('../helpers/env')

const database = config.get('database')[env.getCurrentEnvironment()]

const pool = mysql.createPool({
  host: database.host,
  user: database.user,
  database: database.name,
  password: database.pass,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

module.exports = pool.promise()
