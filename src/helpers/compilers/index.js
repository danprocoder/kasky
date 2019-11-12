const path = require('path')
const fs = require('fs')
const file = require('../file')

exports.getLanguageCompiler = function (language) {
  const compilerPath = path.join(__dirname, 'engines', `${language}.js`)

  return fs.existsSync(compilerPath) ? require(compilerPath) : null
}

const SRC_TYPE_DIR = 'dir'
const SRC_TYPE_FILE = 'file'

/**
 * A base constructor for compilers.
 *
 * @param {string} fileExtensions Type of files to search for if compiling a directory.
 */
exports.createCompilerClass = function (fileExtensions) {
  const BaseCompiler = function (options = {}) {
    this._fileExtensions = fileExtensions
    this._promise = { resolve: null }
    this._options = options
    this._i = 0
  }

  /**
   * @param {string} src Filepath or directory
   */
  BaseCompiler.prototype._loadFiles = function (src) {
    return new Promise((resolve, reject) => {
      if (fs.lstatSync(src).isDirectory()) {
        this._srcType = SRC_TYPE_DIR

        try {
          const dir = src.concat('/**/*')
          file.matches(dir, files => {
            resolve(files)
          })
        } catch (e) {
          reject(e)
        }
      } else {
        this._srcType = SRC_TYPE_FILE
        resolve([src])
      }
    })
  }

  /**
   * Returns the filepath where the compiled output for the current file in _files[_i] will be saved.
   */
  BaseCompiler.prototype._getOutputFilePath = function () {
    if (this._srcType === SRC_TYPE_FILE) {
      return this._dst
    } else if (this._srcType === SRC_TYPE_DIR) {
      const curSrcFilepath = this._files[this._i]
      // Remove the basepath (this._src).
      const relPath = curSrcFilepath.substr(this._src.length + 1)
      return path.join(this._dst, relPath)
    }
  }

  /**
   * Calls the handle() method to compile each of the files in the directory passed as src to compile() until
   * there are no files left. If a path to a single file was passed as src to compile(), the handle() method will
   * be called once to compile it.
   */
  BaseCompiler.prototype._compileCurrentFile = function () {
    if (this._i < this._files.length) {
      const filepath = this._files[this._i]

      // Create output directory if it doesn't exists.
      const outputPath = this._getOutputFilePath()
      fs.mkdirSync(path.dirname(outputPath), { recursive: true })

      // If file is compilable
      const extensionPattern = new RegExp(`\\.(${this._fileExtensions.join('|')})$`)
      if (extensionPattern.test(filepath)) {
        const code = file.readString(filepath)
        this.handle(code)
          .then(result => {
            fs.writeFileSync(outputPath, result)

            this._i++
            this._compileCurrentFile()
          })
      } else {
        console.log(filepath, outputPath)
        file.copyFile(filepath, outputPath)
          .then(() => {
            this._i++
            this._compileCurrentFile()
          })
      }
    } else {
      this._promise.resolve(this._dst)
    }
  }

  /**
   * @param {string} src The path to file or directory to compile.
   * @param {string} dst The filepath or directory to save the result to.
   *
   * @returns {Promise} A promise to compile the file or files in directory
   */
  BaseCompiler.prototype.compile = function (src, dst) {
    this._i = 0
    this._src = src
    this._dst = dst

    const promise = new Promise((resolve) => {
      this._promise.resolve = resolve
    })

    this._loadFiles(src)
      .then(files => {
        this._files = files
        this._compileCurrentFile()
      })

    return promise
  }

  return BaseCompiler
}
