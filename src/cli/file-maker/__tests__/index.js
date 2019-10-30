const fs = require('fs')
const path = require('path')
const string = require('../../../helpers/string')
const fileMaker = require('..')
const config = require('../../../core/config')
const template = require('../../../helpers/template')
const cli = require('../../../helpers/cli')
const packageJson = require('../../../helpers/package')

const testConfig = {
  middlewaresPath: '/path/to/middlewares',
  controllersPath: '/path/to/controllers'
}

const templateDir = path.join(process.cwd(), 'src/cli/file-maker/templates')

describe('Test commands to create generate files', () => {
  beforeAll(() => {
    // Suppress log functions
    jest.spyOn(cli, 'log').mockImplementation(() => {})
    jest.spyOn(cli, 'error').mockImplementation(() => {})

    jest.spyOn(config, 'load').mockImplementation(() => {})

    jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {})
    jest.spyOn(template, 'insertFile').mockImplementation(() => {})

    jest.spyOn(config, 'get').mockImplementation((key) => testConfig[key])
  })

  afterAll(() => jest.restoreAllMocks())

  describe('Test feature to create a middleware file', () => {
    afterEach(() => jest.clearAllMocks())

    it('should call function to create a middleware file.', () => {
      const spy = jest.spyOn(fileMaker, 'makeMiddlewareFile')
      spy.mockImplementation(() => {})

      fileMaker.process('make:middleware', ['--name=ValidateUser'])

      // Ensure configuration file is loaded first.
      expect(config.load).toHaveBeenCalled()

      expect(fileMaker.makeMiddlewareFile).toHaveBeenCalledWith(['--name=ValidateUser'])

      spy.mockRestore()
    })

    it('should create a new middleware file in the middlewares directory', () => {
      // NB: The database path will be retrieved from user's configuration settings.

      fileMaker.process('make:middleware', ['--name=ValidateUser'])

      expect(fs.mkdirSync).toHaveBeenCalledWith(testConfig.middlewaresPath, { recursive: true })

      const templatePath = path.join(templateDir, 'middleware')
      const outputPath = path.join(
        testConfig.middlewaresPath,
        `${string.camelCaseToFilename('ValidateUser')}.js`
      )
      expect(template.insertFile).toHaveBeenCalledWith(
        templatePath, outputPath, { name: 'ValidateUser' }
      )
    })
  })

  describe('Test feature to create a controller file', () => {
    afterEach(() => jest.clearAllMocks())

    it('should call function to create a controller file', () => {
      const spy = jest.spyOn(fileMaker, 'makeControllerFile')
      spy.mockImplementation(() => {})

      fileMaker.process('make:controller', ['--name=UsersController'])

      expect(config.load).toHaveBeenCalledTimes(1)

      spy.mockRestore()
    })

    it('should throw an error if a controller name was not supplied', () => {
      expect(
        () => fileMaker.makeControllerFile([])
      ).toThrow('Name of controller class not supplied')
      expect(fs.mkdirSync).toHaveBeenCalledTimes(0)
    })

    it('should create a new controller file', () => {
      const fileName = 'my-new-controller.js'
      const className = 'MyNewController'

      fileMaker.makeControllerFile(['--name=MyNewController'])

      expect(fs.mkdirSync).toHaveBeenCalledWith(
        testConfig.controllersPath, { recursive: true }
      )

      expect(template.insertFile).toHaveBeenCalledWith(
        path.join(templateDir, 'controller'),
        path.join(testConfig.controllersPath, fileName),
        { package: packageJson.name, name: className }
      )
    })
  })
})
