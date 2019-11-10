exports.camelCaseToFilename = function (name, sep = '-') {
  return name
    .replace(/[A-Z][a-z]/g, (match) => `${sep}${match}`)
    .replace(/([a-z])([A-Z])/g, (match, p1, p2) => `${p1}${sep}${p2}`)
    .replace(new RegExp(`^${sep}|${sep}$`, 'g'), '')
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
