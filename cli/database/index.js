const drop = require('./drop');
const migrate = require('./migrate');
const cli = require('../../helpers/cli');

exports.process = function(command, args) {
  if (cli.hasFlag(args, '--reset')) {
    drop();
  } else {
    migrate();
  }
}
