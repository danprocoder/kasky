const babel = require('@babel/core')
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const cli = require('../../cli')

function Compiler (src, dst, options = { minify: false }) {
  this.i = 0
  this.compiled = 0
  this.src = src
  this.dst = dst
  this.options = options
  this.promise = { resolve: null }
}
Compiler.prototype.next = function () {
  this.i++
  if (this.i < this.files.length) {
    this.handle()
  } else {
    cli.logNewline('Successfully compiled files to', `${chalk.gray(this.dst)}!`)

    this.promise.resolve()
  }
}

Compiler.prototype.getCompilerOptions = function () {
  const babelOptions = {
    cwd: path.join(__dirname, '..'),
    root: path.join(__dirname, '..'),
    configFile: false,
    presets: [
      '@babel/preset-env'
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      ['@babel/plugin-proposal-decorators', { legacy: true }]
    ]
  }
  if (typeof this.options === 'object' && this.options.minify === true) {
    babelOptions.presets.push('babel-preset-minify')
  }
  return babelOptions
}

Compiler.prototype.handle = function () {
  const src = this.files[this.i]

  const dstRelPath = src.substr(this.src.length)

  fs.mkdirSync(
    path.join(this.dst, path.dirname(dstRelPath)),
    { recursive: true }
  )

  babel.transformFileAsync(src, this.getCompilerOptions())
    .then((result) => {
      fs.writeFileSync(path.join(this.dst, dstRelPath), result.code)

      this.compiled++
      cli.stdout.write(`Compiling files (${Math.floor((this.compiled / this.files.length) * 100)}%)`, { before: '\r' })

      this.next()
    })
}

Compiler.prototype.compile = function () {
  cli.log('Compiling', this.src, 'into', this.dst)

  glob(path.join(this.src, '**/*.js'), {}, (err, files) => {
    if (err) {
      throw new Error(err)
    }

    this.files = files
    this.handle()
  })

  return new Promise((resolve) => {
    this.promise.resolve = resolve
  })
}

module.exports = Compiler
