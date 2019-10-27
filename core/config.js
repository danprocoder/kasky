const path = require('path');
const fs = require('fs');

let config;
exports.load = function() {
  config = require(path.join(process.cwd(), 'app.config.json'));
};

function getInjectableValue(p1) {
  const keys = p1.split('.');
  let currentValue = config;

  for (let i = 0; i < keys.length && typeof currentValue !== 'undefined'; i++) {
    currentValue = currentValue[keys[i]];
  }
  return typeof currentValue === 'object' || currentValue instanceof Array
    ? undefined // Didn't point to a valid value
    : currentValue;
}

function parseValueInjections(value) {
  const injectionSyntax = /\{([a-zA-Z\.]+)\}/;

  while (value.match(injectionSyntax)) {
    value = value
        .replace(injectionSyntax, function(match, p1) {
          const inject = getInjectableValue(p1);
          return inject ? inject : match;
        });
  }
  
  return value;
}

exports.get = function(key) {
  
  const value = config[key];
  return typeof value === 'string' ? parseValueInjections(config[key]) : value;
}
