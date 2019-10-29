const path = require('path')
const pool = require('../../database/connection')
const schema = require('../../database/schema')

exports.drop = () => {
  const migrationsPath = path.join(process.cwd(), '/src/database/migrations')

  pool.execute('CREATE TABLE IF NOT EXISTS `migrations`(file VARCHAR(100) NOT NULL)')
    .then(() => pool.execute('SELECT * FROM `migrations`'))
    .then(([rows]) => {
      const deletions = []

      rows.forEach((row) => {
        const filePath = path.join(migrationsPath, row.file)

        const MigrationClass = require(filePath)

        const { query, table } = new MigrationClass().down(schema)

        console.log('Dropping \x1b[2m%s\x1b[0m', table)
        deletions.push(
          pool.execute(query).then(() => console.log('Dropped \x1b[2m%s\x1b[0m', table))
        )
      })

      return Promise.all(deletions)
    })
    .then(() => pool.execute('DROP TABLE `migrations`'))
    .catch((error) => {
      console.error(error)
    })
    .finally(() => {
      process.exit()
    })
}
