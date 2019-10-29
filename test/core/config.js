const { expect } = require('chai');
const config = require('../../src/core/config');

describe('Test src/core/config.js', () => {
  
  it('it should inject all values', () => {
    const parsed = config.parseValues({
      tea: {
        name: '{var.name}',
        type: '{var.type} tea'
      },
      var: {
        name: 'lipton',
        type: 'green'
      },
      rootDir: '/src',
      somePath: '{rootDir}/somePath'
    });

    expect(parsed.tea.name).to.be.eq('lipton');
    expect(parsed.tea.type).to.be.eq('green tea');
    expect(parsed.rootDir).to.be.eq('/src');
    expect(parsed.somePath).to.be.eq('/src/somePath');
  });

});
