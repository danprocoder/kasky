exports.camelCaseToFilename = function (name) {
  return name
    .replace(/[A-Z][a-z]/g, (match) => `-${match}`)
    .replace(/([a-z])([A-Z])/g, (match, p1, p2) => `${p1}-${p2}`)
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

/**
 * Validates a classname. Throws an error if the classname is not valid.
 */
exports.validateClassname = function (name) {
  if (name.match(/[^a-zA-Z0-9]/)) {
    throw new Error('Class name can only contain letters or numbers.')
  } else if (name.match(/^[a-z]/)) {
    throw new Error('Class name must begin with an uppercase letter')
  } else if (name.match(/^[0-9]/)) {
    throw new Error('Class name must begin with an uppercase letter')
  }

  return true
}

exports.validateTablename = function (name) {
  if (name.match(/[^a-zA-Z0-9_$]/)) {
    throw new Error('Database names can only contain characters a-z, A-Z, 0-9, _ and $')
  } else if (/^[0-9]/.test(name)) {
    throw new Error('Database names can only start with a-z, A-Z, $ or _. Numbers are not allowed.')
  }

  return true
}
