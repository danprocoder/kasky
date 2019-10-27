import Migration from './migration/migration';
import Model from './model';
import Schema from './schema';
const migrationCli = require('./migration/cli').default;

const args = process.argv.slice(2);
if (args.length >= 1) {
  if (args[0].match(/^migrate/)) {
    migrationCli(args);
  }
}

export {
  Migration,
  Model,
  Schema
};
