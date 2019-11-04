const PATTERNS = [
  '^\\{([a-zA-Z_-][a-zA-Z0-9_-]*)\\}(:(.+?))?\\??$', // params
  '(.+)\\?$' // optional
]
const PARAM = 0
const OPTIONAL = 1

function parseParam (type, str) {
  if (!type) {
    return new RegExp('^([^\\/]+)$')
  } else if (type === 'number') {
    return new RegExp('^([0-9]+(\\.[0-9]*)?)$')
  } else {
    throw new Error('Unknown type ' + type + ' in ' + str)
  }
}

function getRegex (str) {
  let result
  if (result = str.match(PATTERNS[PARAM])) {
    return {
      name: result[1],
      pattern: parseParam(result[3], str),
      optional: Boolean(str.match(/\?$/))
    }
  } else if (result = str.match(PATTERNS[OPTIONAL])) {
    return {
      pattern: new RegExp('^' + result[1] + '$'),
      optional: true
    }
  }
}

/**
 * @param {*} path
 * @returns {Matcher} Returns a new Matcher object
 */
function pathToRegex (path) {
  const regex = path
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .map(p => {
      if (p.match(PATTERNS.join('|'))) {
        return getRegex(p)
      }

      return { pattern: new RegExp('^' + p + '$'), optional: false }
    })

  return new Matcher(regex)
}

module.exports = pathToRegex

/**
 * @param {any[]} pattern
 */
function Matcher (pattern) {
  this._pattern = pattern
}
Matcher.prototype.exec = function (pathname) {
  // Removing trailing '/'
  pathname = pathname.replace(/^\/+|\/+$/g, '')
  const paths = pathname.split('/')

  let matches = 0

  const params = {}

  let i // counter for this._pattern
  let j // counter for paths
  let match
  for (
    i = 0, j = 0, match;
    i < this._pattern.length && j < paths.length;
  ) {
    const pattern = this._pattern[i]
    if (match = pattern.pattern.exec(paths[j])) {
      if (pattern.name) {
        params[pattern.name] = match[1]
      }
      matches++
      i++
      j++
    } else if (pattern.optional) {
      if (pattern.name) {
        params[pattern.name] = null
      }
      i++
    } else {
      return false
    }
  }

  if (matches !== paths.length) {
    return false
  }

  while (i < this._pattern.length) {
    if (!this._pattern[i].optional) {
      return false
    }
    i++
  }

  return {
    params
  }
}
