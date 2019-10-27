const path = require('path');
const fs = require('fs');

let config = fs.readFileSync(
  path.join(process.cwd(), 'app.config.json'),
  { encoding: 'utf-8' }
);
config = JSON.parse(config);

exports.get = function(key) {
  return config[key];
}
