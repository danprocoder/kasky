const config = require('../../core/config');
config.load();

const drop = require('./drop');
const migrate = require('./migrate');
const cli = require('../../helpers/cli');

exports.process = function(command, args) {
  if (cli.hasFlag(args, '--reset')) {
    drop.drop();
  } else {
    migrate.migrate();
  }
}
