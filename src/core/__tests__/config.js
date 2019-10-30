const config = require('../config')

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
    }).parse()

    expect(parsed.project.config.rootDir).toEqual('/src')
    expect(parsed.project.config.somePath).toEqual('/src/somePath')
    expect(parsed.project.developer.drinks).toEqual('lipton (green tea)')
    expect(parsed.tea.name).toEqual('lipton')
    expect(parsed.tea.type).toEqual('green tea')
    expect(parsed.rootDir).toEqual('/src')
    expect(parsed.somePath).toEqual('/src/somePath')
    expect(parsed.someOtherPath).toEqual('/src/src/somePath/end')
    expect(parsed.o).toEqual(parsed.project.config)
    expect(parsed.unknown).toEqual('{does.not.exists}')
  })
})
