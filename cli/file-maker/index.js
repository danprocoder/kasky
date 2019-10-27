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

exports.process = function(command, args) {
  config.load();
  
  switch (command) {
    case 'make:controller':
      makeControllerFile(args)
      break;

    case 'make:model':
      makeModelFile(args);
      break;
  }
}
