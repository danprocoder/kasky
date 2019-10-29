const fs = require('fs')
const path = require('path')
const string = require('../../../helpers/string')
const fileMaker = require('..')
const config = require('../../../core/config')
const template = require('../../../helpers/template')
const cli = require('../../../helpers/cli')

const testConfig = {
  middlewaresPath: '/path/to/middlewares'
}

const templateDir = path.join(process.cwd(), 'src/cli/file-maker/templates')

describe('Test commands to create generate files', () => {
  beforeAll(() => {
    // Suppress log functions
    jest.spyOn(cli, 'log').mockImplementation(() => {})
    jest.spyOn(cli, 'error').mockImplementation(() => {})

    jest.spyOn(config, 'load').mockImplementation(() => 1)

    jest.spyOn(fs, 'mkdirSync').mockImplementation(() => 1)
    jest.spyOn(template, 'insertFile').mockImplementation(() => 1)

    jest.spyOn(config, 'get').mockImplementation((key) => testConfig[key])
  })

  describe('Test feature to create a middleware file', () => {
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
})
