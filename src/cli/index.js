#!/usr/bin/env node

const chalk = require('chalk')

const fileMakerCommands = /^make:(controller|middleware)$/
const appCommands = /^(init|build|start-server)$/

const args = process.argv.slice(2)
if (args.length >= 1) {
  const command = args[0]
  let resolver

  if (command.match(fileMakerCommands)) {
    resolver = require('./file-maker')
  } else if (command.match(appCommands)) {
    resolver = require('./app')
  } else {
    console.log(chalk.red(`Unknown command '${command}'`))
  }

  if (resolver) {
    try {
      resolver.process(command, args.slice(1))
    } catch (err) {
      console.log(chalk.red(err))
    }
  }
} else {
  console.error(chalk.red('No command specified'))
}
