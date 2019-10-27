const chalk = require('chalk');
const package = require('../package.json');

/**
 * Extract a particular value for a parameter from the command line in the format --<key>=<value>.
 * 
 * @param {array} args An array containing a list of command line arguments.
 * @param {string} key The name of parameter whose value to extract.
 */
exports.extractParam = function(args, key) {
  const pattern = new RegExp(`^--${key}=`);
  const value = args.find(arg => arg.match(pattern));
  return value ? value.substr(key.length + 3) : null;
};

exports.hasFlag = function(args, flag) {
  return args.indexOf(flag) !== -1;
}

exports.log = function(...message) {
  console.log(chalk.gray(package.name) + ':', ...message);
};
