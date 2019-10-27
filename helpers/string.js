exports.camelCaseToFilename = function(name) {
  return name
    .replace(/[A-Z][a-z]/g, function(match) {
      return '-' + match;
    })
    .replace(/([a-z])([A-Z])/g, function(match, p1, p2) {
      return p1 + '-' + p2;
    })
    .replace(/^\-|\-$/g, '')
    .toLowerCase();
};
