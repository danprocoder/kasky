const { expect } = require('chai');
const config = require('../config');

describe('Test src/core/config.js', () => {
  
  it('it should inject all values', () => {
    const parsed = new config.Parser({
      project: {
        config: {
          rootDir: '{rootDir}',
          somePath: '{somePath}'
        },
        developer: {
          drinks: '{tea.name} ({tea.type})'
        }
      },
      tea: {
        name: '{var.name}',
        type: '{var.type} tea'
      },
      var: {
        name: 'lipton',
        type: 'green'
      },
      rootDir: '/src',
      somePath: '{rootDir}/somePath',
      someOtherPath: '{rootDir}{somePath}/end',
      o: '{project.config}',
      unknown: '{does.not.exists}'
    }).parse();

    expect(parsed.project.config.rootDir).to.be.eq('/src');
    expect(parsed.project.config.somePath).to.be.eq('/src/somePath');
    expect(parsed.project.developer.drinks).to.be.eq('lipton (green tea)');
    expect(parsed.tea.name).to.be.eq('lipton');
    expect(parsed.tea.type).to.be.eq('green tea');
    expect(parsed.rootDir).to.be.eq('/src');
    expect(parsed.somePath).to.be.eq('/src/somePath');
    expect(parsed.someOtherPath).to.be.eq('/src/src/somePath/end');
    expect(parsed.o).to.be.eq(parsed.project.config);
    expect(parsed.unknown).to.be.eq('{does.not.exists}');
  });

});
