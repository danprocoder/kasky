const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const packageJson = require('../../helpers/package')
const config = require('../../core/config')
const template = require('../../helpers/template')
const string = require('../../helpers/string')
const cli = require('../../helpers/cli')

module.exports = {

  /**
   * Called by make:controller command to create a controller file.
   *
   * @param {array} args Command line arguments after make:controller.
   */
  makeControllerFile (args) {
    const name = cli.extractParam(args, 'name')
    if (!name) {
      throw new Error('Name of controller class not supplied')
    }

    const className = path.basename(name)
    const subDir = path.dirname(name).replace(/^\/+|\/+$/g, '')

    string.validateClassname(className)

    const fileName = `${string.camelCaseToFilename(className)}.js`
    const controllersPath = path.join(config.get('controllersPath'), subDir)
    fs.mkdirSync(controllersPath, { recursive: true })

    cli.log('Generating', path.join(controllersPath, fileName))

    template.insertFile(
      path.join(__dirname, 'templates/controller'),
      path.join(controllersPath, fileName),
      { package: packageJson.name, name: className }
    )

    cli.log(chalk.green('Generated'), path.join(controllersPath, fileName))
  },

  makeModelFile (args) {
    const name = cli.extractParam(args, 'name')
    if (!name) {
      throw new Error(
        'Model class name not supplied. ' +
        'Use the --name=YourModelClass option to specify a class name.'
      )
    }

    const className = path.basename(name)
    const subDir = path.dirname(name).replace(/^\/+|\/+$/g, '')

    string.validateClassname(className)

    let table = cli.extractParam(args, 'table')
    if (table) {
      string.validateTablename(table)
    } else {
      table = string.camelCaseToFilename(className, '_')
    }

    const fileName = `${string.camelCaseToFilename(className)}.js`
    const modelsPath = path.join(config.get('modelsPath'), subDir)
    fs.mkdirSync(modelsPath, { recursive: true })

    cli.log('Generating', path.join(modelsPath, fileName))

    template.insertFile(
      path.join(__dirname, 'templates/model'),
      path.join(modelsPath, fileName),
      {
        package: packageJson.name,
        name: className,
        decoratorData: table ? `{\r\n  table: '${table}'\r\n}` : ''
      }
    )

    cli.log(chalk.green('Generated'), path.join(modelsPath, fileName))
  },

  /**
   * Called by make:migration command to create a migration file.
   *
   * @param {array} args Command line arguments after make:migration.
   */
  makeMigrationFile (args) {
    const table = cli.extractParam(args, 'table')
    if (!table) {
      throw new Error(
        'Database table name not supplied. ' +
        'Use the --table=your_table_here option to specify a table name.'
      )
    }
    string.validateTablename(table)

    const date = new Date()
    const filename = `${table}-${date.getFullYear()}${date.getMonth()}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`.concat('.js')
    const databasePath = config.get('databasePath')
    fs.mkdirSync(path.join(databasePath, 'migrations'), { recursive: true })

    const targetFilePath = path.join(
      databasePath, 'migrations', filename.replace(/_/g, '-')
    )

    cli.log('Generating', chalk.gray(targetFilePath))

    template.insertFile(
      path.join(__dirname, 'templates/migration'),
      targetFilePath,
      { table }
    )

    cli.log(chalk.green('Generated'), chalk.gray(targetFilePath))
  },

  /**
   *
   * @param {string[]} args
   */
  makeMiddlewareFile (args) {
    const name = cli.extractParam(args, 'name')
    if (!name) {
      throw new Error(
        'Middleware classname not specified. ' +
        'Use the --name=YourMiddleware option to specify the classname.'
      )
    }

    const className = path.basename(name)
    const subDir = path.dirname(name).replace(/^\/+|\/+$/g, '')

    string.validateClassname(className)

    const middlewaresPath = path.join(config.get('middlewaresPath'), subDir)
    fs.mkdirSync(middlewaresPath, { recursive: true })

    const targetFilePath = path.join(
      middlewaresPath, string.camelCaseToFilename(className).concat('.js')
    )

    cli.log('Generating', chalk.gray(targetFilePath))

    template.insertFile(
      path.join(__dirname, 'templates/middleware'),
      targetFilePath,
      { name: className }
    )

    cli.log(chalk.green('Generated'), chalk.gray(targetFilePath))
  },

  process (command, args) {
    config.load()

    switch (command) {
      case 'make:controller':
        this.makeControllerFile(args)
        break

      case 'make:model':
        this.makeModelFile(args)
        break

      case 'make:migration':
        this.makeMigrationFile(args)
        break

      case 'make:middleware':
        this.makeMiddlewareFile(args)
        break
    }
  }
}
