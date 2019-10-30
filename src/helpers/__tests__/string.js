const string = require('../string')

describe('Test string helper functions', () => {
  describe('Text camelCaseToFilename()', () => {
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

  describe('Test validateClassname()', () => {
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

  describe('Test validateTablename()', () => {
    it('should throw an error if database name contains illegal characters', () => {
      expect(() =>
        string.validateTablename('table&*()8789&*(*&^')
      ).toThrow('Database names can only contain characters a-z, A-Z, 0-9, _ and $')
    })

    it('should throw an error if database starts with a number', () => {
      expect(() =>
        string.validateTablename('007blogs')
      ).toThrow('Database names can only start with a-z, A-Z, $ or _. Numbers are not allowed.')
    })

    it('should return true if database name is valid', () => {
      expect(string.validateTablename('users_blogs')).toEqual(true)
      expect(string.validateTablename('$users_blogs')).toEqual(true)
      expect(string.validateTablename('_users_blogs')).toEqual(true)
      expect(string.validateTablename('users_blogs$')).toEqual(true)
      expect(string.validateTablename('users_blogs1')).toEqual(true)
      expect(string.validateTablename('top007users')).toEqual(true)
      expect(string.validateTablename('topusers007')).toEqual(true)
    })
  })
})
