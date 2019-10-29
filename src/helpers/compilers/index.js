const path = require('path')
const fs = require('fs')

exports.getLanguageCompiler = function (language) {
  const compilerPath = path.join(__dirname, 'engines', `${language}.js`)

  return fs.existsSync(compilerPath) ? require(compilerPath) : null
}
