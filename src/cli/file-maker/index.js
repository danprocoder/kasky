const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const package = require('../../package.json');
const config = require('../../core/config');
const template = require('../../helpers/template');
const string = require('../../helpers/string');
const cli = require('../../helpers/cli');

/**
 * Called by make:controller command to create a controller file.
 * 
 * @param {array} args Command line arguments after make:controller.
 */
function makeControllerFile(args) {
  const name = cli.extractParam(args, 'name');
  const fileName = string.camelCaseToFilename(name) + '.js';
  const controllersPath = config.get('controllersPath');
  fs.mkdirSync(controllersPath, { recursive: true });

  cli.log('Generating', path.join(controllersPath, fileName));

  template.insertFile(
    path.join(__dirname, 'templates/controller'),
    path.join(controllersPath, fileName),
    { package: package.name, name }
  );

  cli.log(chalk.green('Generated'), path.join(controllersPath, fileName));
}

function makeModelFile(args) {
  const name = cli.extractParam(args, 'name');
  const table = cli.extractParam(args, 'table');
  const fileName = string.camelCaseToFilename(name) + '.js';
  const modelsPath = config.get('modelsPath');
  fs.mkdirSync(modelsPath, { recursive: true });

  cli.log('Generating', path.join(modelsPath, fileName));

  template.insertFile(
    path.join(__dirname, 'templates/model'),
    path.join(modelsPath, fileName),
    {
      package: package.name,
      name,
      decoratorData: table ? `{\r\n  table: '${table}'\r\n}` : '',
    }
  );
  
  cli.log(chalk.green('Generated'), path.join(modelsPath, fileName));
}

/**
 * Called by make:migration command to create a migration file.
 * 
 * @param {array} args Command line arguments after make:migration.
 */
function makeMigrationFile(args) {
  const table = cli.extractParam(args, 'table');
  if (!table) {
    cli.error('Table name is required.');
    return;
  } else if (!table.match(/^[a-zA-Z][a-zA-Z0-9_]*$/)) {
    cli.error('Table name can only start with a letter, followed by one or more letters, numbers or underscores.');
    return;
  }

  const date = new Date();
  const filename = `${table}-${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`.concat('.js');
  const databasePath = config.get('databasePath');
  fs.mkdirSync(path.join(databasePath, 'migrations'), { recursive: true });

  const targetFilePath = path.join(databasePath, 'migrations', filename.replace(/_/g, '-'));

  cli.log('Generating', chalk.gray(targetFilePath));

  template.insertFile(
    path.join(__dirname, 'templates/migration'),
    targetFilePath,
    { table }
  );

  cli.log(chalk.green('Generated'), chalk.gray(targetFilePath));
}

exports.process = function(command, args) {
  config.load();

  switch (command) {
    case 'make:controller':
      makeControllerFile(args)
      break;

    case 'make:model':
      makeModelFile(args);
      break;

    case 'make:migration':
      makeMigrationFile(args);
      break;

    case 'make:middleware':
      break;
  }
}
