const glob = require('glob')
const path = require('path')
const pool = require('../../database/connection')
const schema = require('../../database/schema')

exports.migrate = () => {
  const migrationsPath = path.join(process.cwd(), '/src/database/migrations')

  glob(`${migrationsPath}/**/*.js`, null, async (er, files) => {
    await pool.execute('CREATE TABLE IF NOT EXISTS `migrations`(file VARCHAR(100) NOT NULL)')

    // Get past migrations
    let [skip] = await pool.execute('SELECT * FROM `migrations`')
    skip = skip.map((row) => row.file)

    const migrated = []

    for (const filePath of files) {
      const fileName = filePath.substr(migrationsPath.length + 1)
      if (skip.indexOf(fileName) !== -1) {
        continue
      }

      console.log('Migrating \x1b[2m%s\x1b[0m', fileName)

      const Migration = require(filePath)
      const schemaResult = new Migration().up(schema)

      await pool.execute(schemaResult.query)

      console.log('\x1b[32m%s\x1b[0m \x1b[2m%s', 'Migrated', fileName)
      migrated.push(`('${fileName}')`)
    }

    if (migrated.length > 0) {
      await pool.execute(`INSERT INTO \`migrations\`(file)VALUES${migrated.join(',')}`)
    }

    process.exit()
  })
}
