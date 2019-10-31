const babel = require('@babel/core')
const path = require('path')
const compilerMaker = require('../index')

const Javascript = compilerMaker.createCompilerClass(['js'])

Javascript.prototype.handle = function (code) {
  const babelOptions = {
    cwd: path.join(__dirname, '../../../..'),
    configFile: false,
    presets: [
      '@babel/preset-env'
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      ['@babel/plugin-proposal-decorators', { legacy: true }]
    ]
  }
  if (typeof this._options === 'object' && this._options.minify === true) {
    babelOptions.presets.push('babel-preset-minify')
  }

  return babel.transformAsync(code, babelOptions).then(result => result.code)
}

module.exports = Javascript
