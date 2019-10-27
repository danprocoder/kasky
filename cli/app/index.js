const fs = require('fs');
const path = require('path');
const config = require('../../core/config');

function camelCaseToFilename(name) {
  return name
    .replace(/[A-Z][a-z]/g, function(match) {
      return '-' + match;
    })
    .replace(/([a-z])([A-Z])/g, function(match, p1, p2) {
      return p1 + '-' + p2;
    })
    .replace(/^\-|\-$/g, '')
    .toLowerCase();
}

function replaceVars(templatePath, vars) {
  return templatePath.replace(/%\{([a-zA-Z]+)\}/g, function(match, varName) {
    const value = vars[varName];
    return value || match;
  });
}

function insertTemplateFile(templatePath, targetFilepath, values={}) {
  const template = fs.readFileSync(templatePath, { encoding: 'utf8' });
  
  fs.writeFileSync(
    targetFilepath,
    replaceVars(template, values),
    'utf8'
  );
};

function makeController(args) {
  const name = args.find(arg => arg.match(/^--name=/)).substr(7);
  const fileName = camelCaseToFilename(name) + '.js';
  const controllersPath = config.get('controllersPath');

  insertTemplateFile(
    path.join(__dirname, 'templates/controller'),
    path.join(controllersPath, fileName),
    { name }
  );
  console.log('pretty-api:', fileName, 'created in', controllersPath);
}

exports.process = function(command, args) {
  switch (command) {
    case 'make:controller':
      makeController(args)
      break;
  }
}
