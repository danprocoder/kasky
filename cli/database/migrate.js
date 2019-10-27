import glob from 'glob';
import path from 'path';
import pool from '../../database/connection';

exports.migrate = () => {
  const migrationsPath = path.join(process.cwd(), '/src/database/migrations');
  
  glob(`${migrationsPath}/**/*.js`, null, async (er, files) => {
    await pool.execute('CREATE TABLE IF NOT EXISTS `migrations`(file VARCHAR(100) NOT NULL)');
  
    // Get past migrations
    let [skip] = await pool.execute('SELECT * FROM `migrations`')
    skip = skip.map(row => row.file);
  
    const migrated = [];
  
    for (let filePath of files) {
      const fileName = filePath.substr(migrationsPath.length + 1);
      if (skip.indexOf(fileName) != -1) {
        continue;
      }
  
      console.log('Migrating \x1b[2m%s\x1b[0m', fileName);
  
      const MigrationClass = require(filePath).default;
      const instance = new MigrationClass();
      const schema = instance.up();
  
      await pool.execute(schema.query);
  
      console.log('\x1b[32m%s\x1b[0m \x1b[2m%s', 'Migrated', fileName);
      migrated.push(`('${fileName}')`);
    }
  
    if (migrated.length > 0) {
      await pool.execute('INSERT INTO `migrations`(file)VALUES' + migrated.join(','));
    }
  
    process.exit();
  });
}
