const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const packageJson = require('../../helpers/package');
const config = require('../../core/config');
const template = require('../../helpers/template');
const string = require('../../helpers/string');
const cli = require('../../helpers/cli');

module.exports = {

  /**
   * Called by make:controller command to create a controller file.
   * 
   * @param {array} args Command line arguments after make:controller.
   */
  makeControllerFile: function(args) {
    const name = cli.extractParam(args, 'name');
    const fileName = string.camelCaseToFilename(name) + '.js';
    const controllersPath = config.get('controllersPath');
    fs.mkdirSync(controllersPath, { recursive: true });

    cli.log('Generating', path.join(controllersPath, fileName));

    template.insertFile(
      path.join(__dirname, 'templates/controller'),
      path.join(controllersPath, fileName),
      { package: packageJson.name, name }
    );

    cli.log(chalk.green('Generated'), path.join(controllersPath, fileName));
  },

  makeModelFile: function(args) {
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
        package: packageJson.name,
        name,
        decoratorData: table ? `{\r\n  table: '${table}'\r\n}` : '',
      }
    );
    
    cli.log(chalk.green('Generated'), path.join(modelsPath, fileName));
  },

  /**
   * Called by make:migration command to create a migration file.
   * 
   * @param {array} args Command line arguments after make:migration.
   */
  makeMigrationFile: function(args) {
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
  },

  /**
   * 
   * @param {string[]} args 
   */
  makeMiddlewareFile: function(args) {
    const name = cli.extractParam(args, 'name');
    if (!name) {
      cli.error('Name of middleware not supplied.');
      return;
    }

    const middlewaresPath = config.get('middlewaresPath');
    fs.mkdirSync(middlewaresPath, { recursive: true });

    const targetFilePath = path.join(middlewaresPath, string.camelCaseToFilename(name).concat('.js'));
    
    cli.log('Generating', chalk.gray(targetFilePath));
    
    template.insertFile(
      path.join(__dirname, 'templates/middleware'),
      targetFilePath,
      { name }
    );

    cli.log(chalk.green('Generated'), chalk.gray(targetFilePath));
  },

  process: function(command, args) {
    config.load();

    switch (command) {
      case 'make:controller':
        this.makeControllerFile(args)
        break;

      case 'make:model':
        this.makeModelFile(args);
        break;

      case 'make:migration':
        this.makeMigrationFile(args);
        break;

      case 'make:middleware':
        this.makeMiddlewareFile(args);
        break;
    }
  }
}
