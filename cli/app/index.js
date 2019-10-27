const chalk = require('chalk');
const appLoader = require('../../core/app-loader');
const server = require('../../core/server');
const cli = require('../../helpers/cli');

exports.process = function(command, args) {
  switch (command) {
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
              cli.log('Server running at', chalk.green(`127.0.0.1:${options.port}`));
            });
        });

      break;
  }
};
