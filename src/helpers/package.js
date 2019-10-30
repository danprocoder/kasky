const path = require('path')

const packageJsonPath = path.join(__dirname, '..', '..', 'package.json')
module.exports = require(packageJsonPath)
