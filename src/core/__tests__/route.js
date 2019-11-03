const methodDecorator = require('../route/decorator')
const register = require('../route/register')
const proxy = require('../route/proxies')
const Path = require('../route/path')
const resolver = require('../route/resolver')
const controllerDec = require('../controller')

describe('Test the @Route.*() decorator', () => {
  describe('Test register() method', () => {
    afterAll(() => {
      register._routes = []
      jest.clearAllMocks()
    })

    it('should register a route', () => {
      function Controller () {}
      Controller.prototype.handleGet = function () {}
      const controllerInstance = new Controller()

      const registered = register.register(
        'GET',
        '/users',
        Controller.prototype,
        'handleGet'
      )
      expect(registered.method).toEqual('GET')
      expect(registered.path).toBeInstanceOf(Path)
      expect(registered.resolveTo.controller).toEqual(Controller.prototype)
      expect(registered.resolveTo.method).toEqual(
        controllerInstance.handleGet
      )
      expect(registered.middlewares).toEqual([])
      expect(register._routes).toContain(registered)
    })

    it('should register a new route with middlewares', () => {
      function Controller () {}
      Controller.prototype.handleGet = function () {}

      function MiddlewareA () {}
      function MiddlewareB () {}

      const registered = register.register(
        'GET',
        '/users',
        Controller.prototype,
        'handleGet',
        {
          middlewares: [MiddlewareA, MiddlewareB]
        }
      )
      expect(register._routes.length).toEqual(2)
      expect(register._routes).toContain(registered)
      expect(registered.middlewares).toEqual([MiddlewareA, MiddlewareB])
    })
  })

  describe('Test decorator', () => {
    beforeAll(() => {
      jest.spyOn(register, 'register')
    })

    it('decorator should register a new route and return a custom descriptor', () => {
      function Controller () {}
      Controller.prototype.handleGet = function () {}

      const decorator = methodDecorator.getDecorator('GET', '/users')
      const descriptor = decorator(Controller.prototype, 'handleGet', {
        value: Controller.prototype.handleGet
      })
      expect(typeof descriptor.get()).toEqual('function')
      expect(typeof descriptor.get().prototype).toEqual('undefined')

      expect(register.register).toHaveBeenCalledWith(
        'GET',
        '/users',
        Controller.prototype,
        'handleGet',
        {} // By default, a default empty object {} is passed as config
      )
    })
  })

  describe('Test decorator proxies', () => {
    beforeAll(() => {
      jest.spyOn(methodDecorator, 'getDecorator')
    })

    afterEach(() => {
      jest.clearAllMocks()
    })

    afterAll(() => {
      register._routes = []
    })

    it('Get() proxy should return a decorator for HTTP GET method', () => {
      const decorator = proxy.Get('/blogs')
      expect(typeof decorator).toEqual('function')
      expect(methodDecorator.getDecorator).toHaveBeenCalledWith('GET', '/blogs')
    })

    it('Post() proxy should return a decorator for HTTP POST method', () => {
      const decorator = proxy.Post('/blog')
      expect(typeof decorator).toEqual('function')
      expect(methodDecorator.getDecorator).toHaveBeenCalledWith('POST', '/blog')
    })

    it('Patch() proxy should return a decorator for HTTP PATCH method', () => {
      const decorator = proxy.Patch('/blog/{id}')
      expect(typeof decorator).toEqual('function')
      expect(methodDecorator.getDecorator).toHaveBeenCalledWith('PATCH', '/blog/{id}')
    })

    it('Put() proxy should return a decorator for HTTP PUT method', () => {
      const decorator = proxy.Put('/blog/{id}')
      expect(typeof decorator).toEqual('function')
      expect(methodDecorator.getDecorator).toHaveBeenCalledWith('PUT', '/blog/{id}')
    })

    it('Delete() proxy should return a decorator for HTTP DELETE method', () => {
      const decorator = proxy.Delete('/blog/{id}')
      expect(typeof decorator).toEqual('function')
      expect(methodDecorator.getDecorator).toHaveBeenCalledWith('DELETE', '/blog/{id}')
    })
  })

  describe('Test route resolver without controller baseRoute', () => {
    let Controller

    beforeAll(() => {
      Controller = function () {}

      Controller.prototype.createBlog = () => {}
      proxy.Post('/api/v1/blog')(
        Controller.prototype,
        'createBlog',
        { value: Controller.prototype.createBlog }
      )

      Controller.prototype.getAllBlogs = () => {}
      proxy.Get('/api/v1/blog')(
        Controller.prototype,
        'getAllBlogs',
        { value: Controller.prototype.getAllBlogs }
      )

      Controller.prototype.deleteBlog = () => {}
      proxy.Delete('/api/v1/blog/{id}')(
        Controller.prototype,
        'deleteBlog',
        { value: Controller.prototype.deleteBlog }
      )

      Controller.prototype.editBlog = () => {}
      proxy.Patch('/api/v1/blog/{id}')(
        Controller.prototype,
        'editBlog',
        { value: Controller.prototype.editBlog }
      )
    })

    afterAll(() => {
      register._routes = []
    })

    it('should return false if the route does not exists', () => {
      const resolved = resolver.resolve('GET', '/unknown/url/path')
      expect(resolved).toEqual(false)
    })

    it('should return createBlog() method', () => {
      const resolved = resolver.resolve('POST', '/api/v1/blog')
      expect(typeof resolved).toEqual('object')
    })

    it('should return getAllBlogs() method', () => {
      const resolved = resolver.resolve('GET', '/api/v1/blog')
      expect(typeof resolved).toEqual('object')
    })

    // it('should return deleteBlog() method', () => {
    //   const resolved = resolver.resolve('DELETE', '/api/v1/blog/6')
    //   expect(typeof resolved).toEqual('object')
    // })

    // it('should return editBlog() method', () => {
    //   const resolved = resolver.resolve('PATCH', '/api/v1/blog/6')
    //   expect(typeof resolved).toEqual('object')
    // })
  })

  describe('Test resolvers with controller base routes', () => {
    beforeAll(() => {
      const Controller = controllerDec({
        baseRoute: '/api/users'
      })(function () {})

      Controller.prototype.getUsers = () => { return 'all users' }
      proxy.Get()(Controller.prototype, 'getUsers', {
        value: Controller.prototype.getUsers
      })

      Controller.prototype.getBlogs = () => { return 'all blogs' }
      proxy.Get('blogs')(Controller.prototype, 'getBlogs', {
        value: Controller.prototype.getBlogs
      })
    })

    afterAll(() => {
      register._routes = []
    })

    it('should return a handler for GET /api/users/', () => {
      const handler = resolver.resolve('GET', '/api/users/')
      expect(typeof handler).toEqual('object')
      expect(handler.method()).toEqual('all users')
    })

    it('should return a handler for GET /api/users (without trailing slash)', () => {
      const handler = resolver.resolve('GET', '/api/users')
      expect(typeof handler).toEqual('object')
      expect(handler.method()).toEqual('all users')
    })

    it('should return a handler for GET /api/users/blogs', () => {
      const handler = resolver.resolve('GET', '/api/users/blogs')
      expect(typeof handler).toEqual('object')
      expect(handler.method()).toEqual('all blogs')
    })

    it('should return a handler for GET api/users/blogs (without preceding /)', () => {
      const handler = resolver.resolve('GET', 'api/users/blogs')
      expect(typeof handler).toEqual('object')
      expect(handler.method()).toEqual('all blogs')
    })
  })

  describe('Test Path object', () => {
    it('should join paths correctly', () => {
      expect(new Path('/', 'path', 'to', '/')._pathname).toEqual('path/to')
      expect(new Path('/', 'path/', '//to', '/')._pathname).toEqual('path/to')
      expect(new Path('/path/', '/to/', '/somewhere/')._pathname).toEqual('path/to/somewhere')
      expect(new Path('    /path/', '/to/    ', '    somewhere/')._pathname).toEqual('path/to/somewhere')
    })

    it('should match routes correctly', () => {
      const path = new Path('base', '/')
      expect(path.match('base')).toBeTruthy()
      expect(path.match('/base')).toBeTruthy()
      expect(path.match('base/')).toBeTruthy()
      expect(path.match('/base/')).toBeTruthy()
    })
  })
})
