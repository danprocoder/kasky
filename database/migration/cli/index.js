const { migrate } = require('./migrate');
const { drop } = require('./drop');

exports.default = (args) => {
  switch (args[0]) {
    case 'migrate':
      migrate();

      break;
    
    case 'migrate:drop':
      drop();

      break;
  }
}
