const fs = require('fs')
const path = require('path')
const fileHelper = require('../../../helpers/file')
const config = require('../../../core/config')
const compilerMaker = require('../../../helpers/compilers')
const env = require('../../../helpers/env')
const app = require('..')

const mockCompilerSpy = jest.fn()

function MockCompiler (...args) {
  mockCompilerSpy(...args)
}
MockCompiler.prototype.compile = () => {
  return Promise.resolve()
}

describe('Test cli/app/index.js', () => {
  let configGetSpy

  beforeAll(() => {
    jest.spyOn(config, 'load').mockImplementation(() => {})
    jest.spyOn(MockCompiler.prototype, 'compile')
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  describe('Test runBuild()', () => {
    beforeAll(() => {
      jest.spyOn(fileHelper, 'readString').mockImplementation(() => 'Loader template')
      jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {})
    })

    afterEach(() => {
      configGetSpy.mockRestore()
      jest.clearAllMocks()
    })

    it('should throw an error if no compiler was found for the specified language', () => {
      configGetSpy = jest.spyOn(config, 'get')
      configGetSpy.mockImplementation(() => '$non-existent-language')

      expect(() =>
        app.runBuild('/src/path', '/dst/path')
      ).toThrow('No compiler found for $non-existent-language')
    })

    it('should call compiler.compile() with the right parameters', () => {
      const spy = jest.spyOn(compilerMaker, 'getLanguageCompiler')
      spy.mockImplementation(() => MockCompiler)

      configGetSpy = jest.spyOn(config, 'get')
      configGetSpy.mockImplementation(() => 'javascript')

      return app.runBuild('/src/path', '/dst/path').then(() => {
        // Call with empty object is not in production
        expect(mockCompilerSpy).toHaveBeenCalledWith({})

        expect(MockCompiler.prototype.compile).toHaveBeenCalledTimes(1)
        expect(MockCompiler.prototype.compile).toHaveBeenCalledWith('/src/path', '/dst/path')
      })
    })

    it('should pass option minify if compile is called in production mode', () => {
      const envSpy = jest.spyOn(env, 'getCurrentEnvironment')
      envSpy.mockImplementation(() => 'production')

      configGetSpy = jest.spyOn(config, 'get')
      configGetSpy.mockImplementation(() => 'javascript')

      return app.runBuild('/src/path', '/dst/path', true).then(() => {
        // Call with minify option if in production
        expect(mockCompilerSpy).toHaveBeenCalledWith({ minify: true })

        envSpy.mockRestore()
      })
    })

    it('should create a loader file after compilation (in development)', () => {
      const envSpy = jest.spyOn(env, 'getCurrentEnvironment')
      envSpy.mockImplementation(() => 'production')

      configGetSpy = jest.spyOn(config, 'get')
      configGetSpy.mockImplementation(() => 'javascript')

      return app.runBuild('/src/path', '/dst/path')
        .then((buildDir) => {
          expect(fs.writeFileSync).toHaveBeenCalledWith(
            path.join(buildDir, 'loader.js'), 'Loader template'
          )

          envSpy.mockRestore()
        })
    })

    it('should create a loader file after compilation (in production)', () => {
      const envSpy = jest.spyOn(env, 'getCurrentEnvironment')
      envSpy.mockImplementation(() => 'production')

      configGetSpy = jest.spyOn(config, 'get')
      configGetSpy.mockImplementation(() => 'javascript')

      return app.runBuild('/src/path', '/dst/path', true)
        .then((buildDir) => {
          expect(fs.writeFileSync).toHaveBeenCalledWith(
            path.join(buildDir, 'loader.js'), 'Loader template'
          )

          envSpy.mockRestore()
        })
    })
  })
})
