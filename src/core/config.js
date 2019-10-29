const path = require('path')

function Parser (config) {
  this.injectionSyntax = /\{([a-zA-Z.]+)\}/
  this.baseConfig = config
}

Parser.prototype._parseValues = function (config) {
  Object.keys(config).forEach((key) => {
    const value = config[key]

    if (typeof value === 'string') {
      config[key] = this._parseValueInjections(value)
    } else if (typeof value === 'object') {
      config[key] = this._parseValues(value)
    }
  })

  return config
}

Parser.prototype.parse = function () {
  return this._parseValues(this.baseConfig)
}

/**
 * @param {string} p1 The key to search for.
 *
 * @return {any|undefined} Returns the value for the searched key or undefined if the key was not found.
 */
Parser.prototype._searchValue = function (p1) {
  const keys = p1.split('.')
  let currentValue = this.baseConfig

  for (let i = 0; i < keys.length && typeof currentValue !== 'undefined'; i++) {
    currentValue = currentValue[keys[i]]
  }

  return currentValue
}

Parser.prototype._parseValueInjections = function (value) {
  let matchResult = value.match(this.injectionSyntax)

  // Run as long as value contains injection syntax
  while (matchResult) {
    const resolvedValue = this._searchValue(matchResult[1])

    if (resolvedValue) {
      if (value === matchResult[0] && typeof resolvedValue !== 'string') {
        value = resolvedValue
        break
      } else {
        value = value.replace(matchResult[0], resolvedValue)
        matchResult = value.match(this.injectionSyntax)
      }
    } else {
      break
    }
  }

  return value
}
let config

exports.load = function () {
  config = require(path.join(process.cwd(), 'app.config.json'))
  config = new Parser(config).parse()
}

exports.get = (key) => config[key]

if (process.env.NODE_ENV === 'test') {
  exports.Parser = Parser
}
