exports.camelCaseToFilename = function (name) {
  return name
    .replace(/[A-Z][a-z]/g, (match) => `-${match}`)
    .replace(/([a-z])([A-Z])/g, (match, p1, p2) => `${p1}-${p2}`)
    .replace(/^-|-$/g, '')
    .toLowerCase()
}
