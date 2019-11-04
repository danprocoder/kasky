const pathToRegex = require('../pathToRegex')

describe('Test path to regex converter', () => {
  describe('Test to ensure that patterns matches pathnames correctly', () => {
    it('should match routes correctly (with url paramaters)', () => {
      const re = pathToRegex('/user/{id}')
      expect(re.exec('user/6')).toBeTruthy()
    })

    it('should match /user/{id}:number correctly', () => {
      const re = pathToRegex('/user/{id}:number')
      expect(re.exec('user/6')).toBeTruthy()
      expect(re.exec('user/username')).toEqual(false)
    })

    it('should throw an error if type is unknown in /user/{username}:zdidis', () => {
      expect(() =>
        pathToRegex('/user/{username}:zdidis')
      ).toThrow()
    })

    it('should match /user/blogs/(category)?/list correctly', () => {
      const re = pathToRegex('/user/blogs/(category)?/list')
      expect(re.exec('/user/blogs/category/list')).toBeTruthy()
      expect(re.exec('/user/blogs/list')).toBeTruthy()
      expect(re.exec('/user/blogs/list/movies')).toEqual(false)
      expect(re.exec('/user/blogs')).toEqual(false)
    })

    it('should match /user/blogs/list/{category}? correctly', () => {
      const re = pathToRegex('/user/blogs/list/{category}?/')
      expect(re.exec('/user/blogs/list/movies')).toBeTruthy()
      expect(re.exec('/user/blogs/list/music')).toBeTruthy()
      expect(re.exec('/user/blogs/list/fashion')).toBeTruthy()
      expect(re.exec('/user/blogs/list')).toBeTruthy()
      expect(re.exec('/user/blogs')).toEqual(false)
    })

    it('should match /user/{id}:number?/blogs correctly', () => {
      const re = pathToRegex('/user/{id}:number?/blogs')
      expect(re.exec('/user/27/blogs')).toBeTruthy()
      expect(re.exec('/user/blogs')).toBeTruthy()
      expect(re.exec('/user/john/blogs')).toEqual(false)
    })

    it('should match /products/(active|inactive) correctly', () => {
      const re = pathToRegex('/products/(active|inactive)')
      expect(re.exec('/products/inactive')).toBeTruthy()
      expect(re.exec('/products/active')).toBeTruthy()
      expect(re.exec('/products')).toEqual(false)
    })

    it('should match /products/(in)?active/list correctly', () => {
      const re = pathToRegex('/products/(in)?active/list')
      expect(re.exec('/products/inactive/list')).toBeTruthy()
      expect(re.exec('/products/active/list')).toBeTruthy()
      expect(re.exec('/products/inactive')).toEqual(false)
    })

    it('should match /products/((in)?active)?/list correctly', () => {
      const re = pathToRegex('/products/((in)?active)?/list')
      expect(re.exec('/products/inactive/list')).toBeTruthy()
      expect(re.exec('/products/active/list')).toBeTruthy()
      expect(re.exec('/products/list')).toBeTruthy()
      expect(re.exec('/products/active')).toEqual(false)
    })

    it('should match /products?/list correctly', () => {
      const re = pathToRegex('/products?/list')
      expect(re.exec('/products/list')).toBeTruthy()
      expect(re.exec('/list')).toBeTruthy()
      expect(re.exec('/products')).toEqual(false)
    })
  })
})
