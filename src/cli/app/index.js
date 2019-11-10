const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const server = require('../../core/server')
const config = require('../../core/config')
const cli = require('../../helpers/cli')
const project = require('./project')
const env = require('../../helpers/env')
const cleanUp = require('../../helpers/clean-up')
const compilerFactory = require('../../helpers/compilers')
const fileHelper = require('../../helpers/file')

/**
 * @return {string} Returns the absolute path to the application's source files.
 */
function getAppRootDir () {
  const rootDir = config.get('rootDir') || 'src'
  return path.join(process.cwd(), rootDir)
}

/**
 *
 * @param {string} src Directory in project to compile to build folder.
 * @param {string} dst The directory to save the compiled files.
 * @param {boolean} production Whether to run build in production mode or not.
 *
 * @return {Promise<string>} A promise to build the app.
 */
function runBuild (src, dst, production = false) {
  const language = config.get('language') || 'javascript'
  const Compiler = compilerFactory.getLanguageCompiler(language)
  if (Compiler === null) {
    throw new Error(`No compiler found for ${language}`)
  }

  const compilerOptions = {}
  if (production) {
    compilerOptions.minify = true
  }

  return new Compiler(compilerOptions)
    .compile(src, dst)
    .then(() => {
      // Insert loader file.
      const loader = fileHelper.readString(path.join(__dirname, '/template/loader'))
      fs.writeFileSync(path.join(dst, 'loader.js'), loader)

      return dst
    })
}

/**
 * @return {string} Return the path to the production build directory of
 * the app.
 */
function getProductionBuildFolder () {
  return config.get('buildDir') || 'build'
}

/**
 *
 * @param {*} envType The enviroment type is app should run on: production,
 * development or test.
 *
 * @return {Promise<string>} Full absolute path to the app's build directory.
 * This is where is app will be served from.
 */
function beforeServer (envType) {
  if (envType === 'production') {
    return new Promise((resolve) => {
      const buildFolder = getProductionBuildFolder()
      const buildDir = path.join(process.cwd(), buildFolder)
      if (!fs.existsSync(buildDir)) {
        throw new Error(
          'build folder was not found. Run `npm build` to build the app.'
        )
      }

      resolve(buildDir)
    })
  }

  // Create a temporary build folder for test and development mode.
  const appPackage = require(path.join(process.cwd(), 'package.json'))
  return fileHelper.createCacheDir(
    appPackage.name,
    'build'
  )
    .then((tmpDir) => {
      cleanUp.addDir(tmpDir)

      let rootDir = config.get('rootDir')
      if (!rootDir) {
        throw new Error(
          'Please specify your project\'s root directory in ' +
                'your app.config.json'
        )
      }

      rootDir = path.join(process.cwd(), rootDir)
      return runBuild(rootDir, tmpDir)
    })
    .then((buildDir) => {
      // Create symlinks for project's node modules
      const linkTo = path.join(process.cwd(), 'node_modules')
      const linkPath = path.join(buildDir, 'node_modules')
      if (!fs.existsSync(linkPath) && fs.existsSync(linkTo)) {
        fs.symlinkSync(linkTo, linkPath, 'dir')
      }

      return buildDir
    })
}

exports.process = function (command, args) {
  switch (command) {
    case 'init': {
      const name = args[0]
      if (!name) {
        cli.log('Project name is required.')
      } else {
        new project.Project(name).make()
      }

      break
    }

    case 'build':
      config.load()

      cli.log('Building...')

      runBuild(
        getAppRootDir(),
        path.join(process.cwd(), getProductionBuildFolder()),
        cli.hasFlag(args, '--prod')
      )
        .then(() => {
          console.log('Build finished!')
        })

      break

    case 'start-server': {
      config.load()

      const envType = env.getCurrentEnvironment()

      beforeServer(envType)
        .then((buildDir) => {
          const appLoader = require(`${buildDir}/loader.js`)

          const controllersPath = config.get('controllersPath')
          return appLoader.load(path.join(buildDir, controllersPath))
        })
        .then(() => {
          cli.log('Starting server...')

          let port = cli.extractParam(args, 'port')
          if (!port) {
            port = process.env.PORT || 0
          }
          new server.Server({ port })
            .start((options) => {
              cli.log('Server running at',
                `${chalk.green(`127.0.0.1:${options.port}`)}.`,
                'Use Ctrl + C to stop the server.')
            })
        })
        .catch((error) => {
          console.log(chalk.red(error))
          console.log(cli.stackTrace(error.stack))
        })

      break
    }
  }
}

process.on('exit', () => cleanUp.cleanUp())

if (env.getCurrentEnvironment() === 'test') {
  exports.runBuild = runBuild
}
