const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const packageJson = require('../../helpers/package')
const cli = require('../../helpers/cli')
const template = require('../../helpers/template')

/**
 *
 * @param {string} name The name of the new project to create.
 */
function Project (name) {
  this.name = name

  this.folders = [
    'src/controllers',
    'src/middlewares'
  ]

  this.files = [
    {
      target: 'package.json',
      template: 'package.template.json',
      data: {
        name,
        framework: packageJson.name,
        frameworkVersion: packageJson.version
      }
    },
    {
      target: 'jsconfig.json',
      template: 'jsconfig.template.json'
    },
    {
      target: 'app.config.json',
      template: 'app.config.template.json'
    },
    {
      target: 'src/app.js',
      template: 'src/app.template'
    },
    {
      target: '.gitignore',
      template: '.gitignore.template'
    }
  ]
}

Project.prototype.make = function () {
  // Create folders.
  this.folders.forEach((folder) => {
    fs.mkdirSync(path.join(process.cwd(), this.name, folder),
      { recursive: true })
  })

  // Create project files.
  this.files.forEach((file) => {
    const targetFilePath = path.join(process.cwd(), this.name, file.target)
    cli.log('Generating', chalk.gray(targetFilePath))

    template.insertFile(
      path.join(__dirname, 'template', file.template),
      targetFilePath,
      file.data
    )

    cli.log(chalk.green('Generated'), chalk.gray(targetFilePath))
  })
}

exports.Project = Project
