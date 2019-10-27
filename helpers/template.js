const fs = require('fs');

function replaceVars(templatePath, vars) {
  return templatePath.replace(/%\{([a-zA-Z]+)\}/g, function(match, varName) {
    const value = vars[varName];
    return typeof value !== 'undefined' ? value : match;
  });
}

exports.insertFile = function(templatePath, targetFilepath, values={}) {
  const template = fs.readFileSync(templatePath, { encoding: 'utf8' });
  
  fs.writeFileSync(
    targetFilepath,
    typeof values === 'object'
      ? replaceVars(template, values)
      : template,
    'utf8'
  );
};
