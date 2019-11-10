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
    jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {})
    jest.spyOn(template, 'insertFile').mockImplementation(() => {})

    // Suppress log functions
    jest.spyOn(cli, 'log').mockImplementation(() => {})
    jest.spyOn(cli, 'error').mockImplementation(() => {})

    jest.spyOn(config, 'load').mockImplementation(() => {})
    jest.spyOn(config, 'get').mockImplementation((key) => testConfig[key])

    jest.spyOn(string, 'validateClassname')
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

    it('should throw an error if --name options is not specified', () => {
      expect(
        () => fileMaker.makeMiddlewareFile([])
      ).toThrow(
        'Middleware classname not specified. ' +
        'Use the --name=YourMiddleware option to specify the classname.'
      )
    })

    it('should create a new middleware file in the middlewares directory', () => {
      fileMaker.process('make:middleware', ['--name=ValidateUser'])

      // Must validate classname
      expect(string.validateClassname).toHaveBeenCalledWith('ValidateUser')

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

    it('should create a new middleware file in a subdirectory', () => {
      const filename = 'validate-user.js'
      const className = 'ValidateUser'
      const migrationDir = path.join(testConfig.middlewaresPath, 'sub/dir')

      fileMaker.process('make:middleware', [`--name=sub/dir/${className}`])

      expect(string.validateClassname).toHaveBeenCalledWith(className)

      expect(fs.mkdirSync).toHaveBeenCalledWith(migrationDir, { recursive: true })

      expect(template.insertFile).toHaveBeenCalledWith(
        path.join(templateDir, 'middleware'),
        path.join(migrationDir, filename),
        { name: className }
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

      // Must validate classname
      expect(string.validateClassname).toHaveBeenCalledWith('MyNewController')

      expect(fs.mkdirSync).toHaveBeenCalledWith(
        testConfig.controllersPath, { recursive: true }
      )

      expect(template.insertFile).toHaveBeenCalledWith(
        path.join(templateDir, 'controller'),
        path.join(testConfig.controllersPath, fileName),
        { package: packageJson.name, name: className }
      )
    })

    it('should create a new controller file in a subdirectory', () => {
      const fileName = 'my-new-controller.js'
      const className = 'MyNewController'
      const controllerDir = path.join(testConfig.controllersPath, 'sub/dir')

      fileMaker.makeControllerFile([`--name=/sub/dir/${className}`])

      // Must validate classname
      expect(string.validateClassname).toHaveBeenCalledWith(className)

      // Should attempt to create the directory to save the controller class
      expect(fs.mkdirSync).toHaveBeenCalledWith(
        path.join(controllerDir),
        { recursive: true }
      )

      // Should insert the template file
      expect(template.insertFile).toHaveBeenCalledWith(
        path.join(templateDir, 'controller'),
        path.join(controllerDir, fileName),
        { package: packageJson.name, name: className }
      )
    })
  })
})
