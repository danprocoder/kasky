const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const os = require('os')
const packageJson = require('../../helpers/package')
const appLoader = require('../../core/app-loader')
const server = require('../../core/server')
const config = require('../../core/config')
const cli = require('../../helpers/cli')
const fileHelper = require('../../helpers/file')
const project = require('./project')
const env = require('../../helpers/env')
const compilers = require('../../helpers/compilers')

const cleanUp = {
  filesToCleanUp: [],

  addDir (pathToClean) {
    this.filesToCleanUp.push(pathToClean)
  },

  cleanUp () {
    this.filesToCleanUp.forEach((dir) => {
      fileHelper.deleteDir(dir)
    })
  }
}

/**
 * @return {string} Returns the absolute path to the application's source files.
 */
function getAppRootDir () {
  const rootDir = config.get('rootDir') || 'src'
  return path.join(process.cwd(), rootDir)
}

/**
 * @return {Promise<string>}
 */
function createAppTempBuildDir () {
  return new Promise((resolve, reject) => {
    const appPackage = require(path.join(process.cwd(), 'package.json'))

    const tmpDir = path.join(
      os.tmpdir(),
      packageJson.name,
      appPackage.name,
      'build'
    )
    fs.mkdir(tmpDir, { recursive: true }, (err) => {
      if (!err) {
        resolve(tmpDir)
      } else {
        reject(err)
      }
    })
  })
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
  const Compiler = compilers.getLanguageCompiler(language)
  if (Compiler === null) {
    throw new Error(`No compiler found for ${language}`)
  }

  const compilerOptions = {}
  if (production) {
    compilerOptions.minify = true
  }

  return new Compiler(compilerOptions).compile(src, dst).then(() => dst)
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

  return createAppTempBuildDir()
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
      fs.symlinkSync(
        path.join(process.cwd(), 'node_modules'),
        path.join(buildDir, 'node_modules'),
        'dir'
      )

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
          appLoader.loadApp(buildDir)

          cli.log('Starting server...')

          let port = cli.extractParam(args, 'port')
          if (!port) {
            port = process.env.PORT || 0
          }
          new server.Server({ port })
            .start((options) => {
              cli.log('Server running at',
                `${chalk.green(`127.0.0.1:${options.port}`)}.`,
                'Use Ctrl + C to stop server.')
            })
        })
        .catch((error) => {
          cli.error(error)
        })

      break
    }
  }
}

process.on('exit', () => cleanUp.cleanUp())

if (env.getCurrentEnvironment() === 'test') {
  exports.runBuild = runBuild
}
