const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const appLoader = require('../../core/app-loader');
const server = require('../../core/server');
const cli = require('../../helpers/cli');
const template = require('../../helpers/template');

function Project(name) {
  const folders = [
    'src/controllers',
    'src/middlewares',
    'src/models',
    'src/database/migrations'
  ];

  const files = [
    {
      target: 'package.json',
      template: 'package.template.json',
      data: { name }
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
      template: 'src/app.template.js'
    },
    {
      target: '.gitignore',
      template: '.gitignore.template'
    }
  ];

  // Create folders.
  folders.forEach(folder => {
    fs.mkdirSync(path.join(process.cwd(), folder), { recursive: true });
  });

  // Create project files.
  files.forEach(file => {
    const targetFilePath = path.join(process.cwd(), file.target);
    cli.log('Generating', chalk.gray(targetFilePath));

    template.insertFile(
      path.join(__dirname, 'template', file.template),
      targetFilePath,
      file.data
    );

    cli.log(chalk.green('Generated'), chalk.gray(targetFilePath));
  });
}

exports.process = function(command, args) {
  switch (command) {

    case 'init':
      const name = args[0];
      if (!name) {
        cli.log('Project name is required.');
      } else {
        new Project(name);
      }

      break;

    case 'start-server':
      cli.log('Loading app..');

      appLoader.loadApp()
        .then(() => {
          cli.log('Starting server...');

          let port = cli.extractParam(args, 'port');
          if (!port) {
            port = process.env.PORT || 0;
          }
          new server.Server({ port })
            .start((options) => {
              cli.log('Server running at', chalk.green(`127.0.0.1:${options.port}`) + '.', 'Use Ctrl + C or Cmd + C to stop server.');
            });
        });

      break;
  }
};
