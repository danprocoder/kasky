#!/usr/bin/env node

const databaseCommands = /^(migrate) /;
const appCommands = /^(init|make:controller|make:migration|make:model)/;

const args = process.argv.slice(2);
if (args.length >= 1) {
  const command = args[0];
  let resolver;

  if (command.match(databaseCommands)) {
    resolver = require('./database');
  } else if (command.match(appCommands)) {
    resolver = require('./app');
  } else {
    console.error(`pretty-api: Invalid command '${command}'`);
  }
  
  if (resolver) {
    resolver.process(command, args.slice(1));
  }
} else {
  console.error(`pretty-api: No command`);
}
