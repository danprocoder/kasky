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

  it('should throw an error if classname contains invalid characters', () => {
    const illegalNames = [
      '$6789Illegal.</classname-+',
      'hyphenated-classname',
      'underscore_separated_classname'
    ]
    illegalNames.forEach(name => {
      expect(() =>
        string.validateClassname(name)
      ).toThrow('Class name can only contain letters or numbers.')
    })
  })

  it('should throw an error if classname is valid but starts with a small letter', () => {
    expect(() =>
      string.validateClassname('camelCase')
    ).toThrow('Class name must begin with an uppercase letter')
  })

  it('should throw an error if classname starts with a number', () => {
    expect(() =>
      string.validateClassname('0CamelCase')
    ).toThrow('Class name must begin with an uppercase letter')
  })

  it('should return true if classname is valid', () => {
    expect(string.validateClassname('CamelCase')).toEqual(true)
    expect(string.validateClassname('CamelCase007')).toEqual(true)
  })
})
