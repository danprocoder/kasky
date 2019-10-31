const babel = require('@babel/core')
const path = require('path')
const Javascript = require('../javascript')

const BABEL_CWD = path.join(path.dirname(__dirname), '../../../..')

jest.mock('@babel/core', () => ({
  transformAsync: jest.fn(() =>
    Promise.resolve({ code: 'output-source' })
  )
}))

jest.mock('../../../../helpers/file', () => {
  return {
    readString: jest.fn(() => 'input-source')
  }
})

jest.mock('fs', () => ({
  lstatSync: jest.fn(() => ({
    isDirectory: () => false
  })),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn()
}))

describe('Test javascript compiler', () => {
  let compiler

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('should call babel with the correct parameters', () => {
    compiler = new Javascript()

    return compiler.compile('input-source.js', 'output-source.js')
      .then(() => {
        expect(babel.transformAsync).toHaveBeenCalledTimes(1)
        expect(babel.transformAsync).toHaveBeenCalledWith(
          'input-source',
          {
            cwd: BABEL_CWD,
            configFile: false,
            presets: [
              '@babel/preset-env'
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              ['@babel/plugin-proposal-decorators', { legacy: true }]
            ]
          }
        )
      })
  })

  it('should call babel with babel-preset-minify preset if minify option is set to true', () => {
    compiler = new Javascript({ minify: true })

    return compiler.compile('input-source.js', 'output-source.js')
      .then(() => {
        expect(babel.transformAsync).toHaveBeenCalledTimes(1)
        expect(babel.transformAsync).toHaveBeenCalledWith(
          'input-source',
          {
            cwd: BABEL_CWD,
            configFile: false,
            presets: [
              '@babel/preset-env',
              'babel-preset-minify'
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
              ['@babel/plugin-proposal-decorators', { legacy: true }]
            ]
          }
        )
      })
  })

  it('promise should return what babel returns', () => {
    compiler = new Javascript()
    return expect(
      compiler.handle('input-source')
    ).resolves.toEqual('output-source')
  })
})
