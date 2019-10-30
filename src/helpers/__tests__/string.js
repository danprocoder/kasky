const string = require('../string')

describe('Test string helper functions', () => {
  it('should convert a camelcase to a sring separated by an hyphen', () => {
    const testCases = {
      HelloNSThereF: 'hello-ns-there-f',
      HelloNS1ThereF: 'hello-ns1-there-f'
    }

    Object.keys(testCases).forEach(key => {
      expect(string.camelCaseToFilename(key)).toEqual(testCases[key])
    })
  })
})
