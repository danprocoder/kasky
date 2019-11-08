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
  controllersPath: '/path/to/controllers',
  databasePath: '/path/to/database',
  modelsPath: '/path/to/models'
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
    jest.spyOn(string, 'validateTablename')
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

  describe('Test feature to make a migration file from the command line', () => {
    afterEach(() => jest.clearAllMocks())

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

    it('should create a migration file', () => {
      fileMaker.makeMigrationFile(['--table=users_blogs'])

      const migrationsDir = path.join(testConfig.databasePath, 'migrations')

      expect(string.validateTablename).toHaveBeenCalledWith('users_blogs')

      expect(fs.mkdirSync).toHaveBeenCalledTimes(1)
      expect(fs.mkdirSync).toHaveBeenCalledWith(migrationsDir, { recursive: true })

      expect(template.insertFile).toHaveBeenCalledTimes(1)
      const callArgs = template.insertFile.mock.calls[0]
      expect(callArgs[0]).toEqual(path.join(templateDir, 'migration'))
      expect(callArgs[1]).toMatch(new RegExp(
        path.join(migrationsDir, 'users-blogs-[0-9]{9,14}\\.js$')
      ))
      expect(callArgs[2]).toEqual({ table: 'users_blogs' })
    })
  })

  describe('Test feature to make a model file from the command line', () => {
    afterEach(() => jest.clearAllMocks())

    it('should call function to create a model file', () => {
      const spy = jest.spyOn(fileMaker, 'makeModelFile')
      spy.mockImplementation(() => {})

      fileMaker.process('make:model', ['--name=MyModel'])
      expect(fileMaker.makeModelFile).toHaveBeenCalledWith(['--name=MyModel'])

      spy.mockRestore()
    })

    it('should throw an error if --name option is not supplied', () => {
      expect(() =>
        fileMaker.makeModelFile([])
      )
        .toThrow(
          'Model class name not supplied. ' +
          'Use the --name=YourModelClass option to specify a class name.'
        )
    })

    it('should create a new model file without --table option specified', () => {
      fileMaker.makeModelFile(['--name=UsersBlogs'])

      expect(string.validateTablename).toHaveBeenCalledTimes(0)

      expect(string.validateClassname).toHaveBeenCalledWith('UsersBlogs')

      expect(fs.mkdirSync).toHaveBeenCalledTimes(1)
      expect(fs.mkdirSync).toHaveBeenCalledWith(testConfig.modelsPath, { recursive: true })

      expect(template.insertFile).toHaveBeenCalledWith(
        path.join(templateDir, 'model'),
        path.join(testConfig.modelsPath, 'users-blogs.js'),
        {
          package: packageJson.name,
          name: 'UsersBlogs',
          decoratorData: "{\r\n  table: 'users_blogs'\r\n}"
        }
      )
    })

    it('should create a new model file with --table option specified', () => {
      fileMaker.makeModelFile(['--name=UsersBlogs', '--table=users_blogs'])

      expect(string.validateClassname).toHaveBeenCalledWith('UsersBlogs')

      expect(string.validateTablename).toHaveBeenCalledWith('users_blogs')

      expect(fs.mkdirSync).toHaveBeenCalledTimes(1)
      expect(fs.mkdirSync).toHaveBeenCalledWith(testConfig.modelsPath, { recursive: true })

      expect(template.insertFile).toHaveBeenCalledWith(
        path.join(templateDir, 'model'),
        path.join(testConfig.modelsPath, 'users-blogs.js'),
        {
          package: packageJson.name,
          name: 'UsersBlogs',
          decoratorData: "{\r\n  table: 'users_blogs'\r\n}"
        }
      )
    })

    it('should create a new model file in a subdirectory', () => {
      const fileName = 'users-blogs.js'
      const className = 'UsersBlogs'
      const modelDir = path.join(testConfig.modelsPath, 'sub/dir')

      fileMaker.makeModelFile([`--name=sub/dir/${className}`])

      expect(string.validateClassname).toHaveBeenCalledWith(className)

      expect(fs.mkdirSync).toHaveBeenCalledWith(modelDir, { recursive: true })

      expect(template.insertFile).toHaveBeenCalledWith(
        path.join(templateDir, 'model'),
        path.join(modelDir, fileName),
        {
          package: packageJson.name,
          name: className,
          decoratorData: "{\r\n  table: 'users_blogs'\r\n}"
        }
      )
    })
  })
})

// const migration = {
//   table: 'Users',
//   fields: [
//     Type.string('firstname', 255).unique(),
//     Type.integer('age').acceptNull(false).default(),
//   ],
//   relations: [
//     belongsTo('users.id')
//   ],
//   primaryKey: 'firstname'
// }
