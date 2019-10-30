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

    it('should throw an error if --name options is not specified', () => {
      expect(
        () => fileMaker.makeMiddlewareFile([])
      ).toThrow(
        'Middleware classname not specified. ' +
        'Use the --name=YourMiddleware option to specify the classname.'
      )
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

  describe('Test feature to make a migration file from the command line', () => {
    it('should call function to create a migration file', () => {
      const spy = jest.spyOn(fileMaker, 'makeMigrationFile')
      spy.mockImplementation(() => {})

      fileMaker.process('make:migration', ['--table=users_blogs'])
      expect(fileMaker.makeMigrationFile).toHaveBeenCalledWith(['--table=users_blogs'])

      spy.mockRestore()
    })

    it('should throw an error if --table option is not specified', () => {
      expect(() => fileMaker.makeMigrationFile([]))
        .toThrow(
          'Database table name not supplied. ' +
          'Use the --table=your_table_here option to specify a table name.'
        )
    })

    it('should throw an error if user enters an invalid table name', () => {
      const illegalNames = [
        '123tablename',
        '#$%^&*)(*&^%^&*(',
        '123456789'
      ]

      illegalNames.forEach((name) => {
        expect(
          () => fileMaker.makeMigrationFile([`--table=${name}`])
        ).toThrow(
          'Table name can only start with a letter, followed by one or more letters, numbers or underscores.'
        )
      })
    })
  })
})
