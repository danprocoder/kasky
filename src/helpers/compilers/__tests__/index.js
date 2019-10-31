const fs = require('fs')
const compiler = require('../')
const file = require('../../../helpers/file')

const sourceFiles = {
  '/path/to/3files/source1.js': 'class Source1 {}',
  '/path/to/3files/sub/source2.js': 'class Source2 {}',
  '/path/to/3files/sub1/sub2/source3.js': 'class Source3 {}'
}

const results = {
  'class Source1 {}': 'class Source1 -> ()',
  'class Source2 {}': 'class Source2 -> ()',
  'class Source3 {}': 'class Source3 -> ()'
}

const FakeCompiler = compiler.createCompilerClass(['js', 'jsx'])

FakeCompiler.prototype.handle = function (code) {
  return Promise.resolve(results[code])
}

describe('Test compiler base constructor', () => {
  let compiler
  let lstatSyncSpy
  let readFileSpy

  beforeAll(() => {
    compiler = new FakeCompiler({ minify: true })
    jest.spyOn(compiler, 'handle')

    jest.spyOn(fs, 'mkdirSync').mockImplementation(() => {})
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {})

    readFileSpy = jest.spyOn(file, 'readString')
    readFileSpy.mockImplementation((filename) => sourceFiles[filename])

    jest.spyOn(file, 'matches')
      .mockImplementation((pattern, callback) =>
        callback([
          '/path/to/3files/source1.js',
          '/path/to/3files/sub/source2.js',
          '/path/to/3files/sub1/sub2/source3.js'
        ])
      )
  })

  afterAll(() => jest.restoreAllMocks())

  it('should set the extensions and options', () => {
    expect(compiler._fileExtensions).toEqual(['js', 'jsx'])
    expect(compiler._options).toEqual({ minify: true })
  })

  describe('Test _loadFiles()', () => {
    afterEach(() => lstatSyncSpy.mockRestore())

    it('should set files to an array of one filepath is src is a filepath', () => {
      lstatSyncSpy = jest.spyOn(fs, 'lstatSync')
      lstatSyncSpy.mockImplementation(() => {
        return { isDirectory: () => false }
      })

      return expect(
        compiler._loadFiles('/path/to/3files/source1.js')
      ).resolves.toEqual(['/path/to/3files/source1.js'])
    })

    it('should set files to an array of 3 filepaths if src is a directory', () => {
      lstatSyncSpy = jest.spyOn(fs, 'lstatSync')
      lstatSyncSpy.mockImplementation(() => {
        return { isDirectory: () => true }
      })

      const fn = () => {
        return compiler._loadFiles('/path/to/3files')
          .then(files => {
            expect(file.matches.mock.calls[0][0]).toEqual('/path/to/3files/**/*.@(js|jsx)')
            return files
          })
      }

      return expect(fn()).resolves.toEqual([
        '/path/to/3files/source1.js',
        '/path/to/3files/sub/source2.js',
        '/path/to/3files/sub1/sub2/source3.js'
      ])
    })
  })

  describe('Test feature to compile a single file', () => {
    beforeAll(() => {
      jest.clearAllMocks()

      lstatSyncSpy = jest.spyOn(fs, 'lstatSync')
      lstatSyncSpy.mockImplementation(() => {
        return { isDirectory: () => false }
      })

      return compiler.compile('/path/to/3files/source1.js', '/output/path/source1.js')
    })

    afterAll(() => {
      lstatSyncSpy.mockRestore()
    })

    it('should set _srcType to file', () => {
      expect(compiler._srcType).toEqual('file')
    })

    it('should set the _files property to an array of one filepath', () => {
      expect(compiler._files).toEqual(['/path/to/3files/source1.js'])
    })

    it('should call handle() once with code to compile', () => {
      expect(compiler.handle).toHaveBeenCalledTimes(1)
      expect(compiler.handle).toHaveBeenCalledWith('class Source1 {}')
    })

    it('should read from the right file', () => {
      expect(file.readString).toHaveBeenCalledTimes(1)
      expect(file.readString).toHaveBeenCalledWith('/path/to/3files/source1.js')
    })

    it('should attempt to create the output directory if it doesn\'t exists', () => {
      expect(fs.mkdirSync).toHaveBeenCalledTimes(1)
      expect(fs.mkdirSync).toHaveBeenCalledWith('/output/path', { recursive: true })
    })

    it('should write the compiled code to the output filepath', () => {
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1)
      expect(fs.writeFileSync).toHaveBeenCalledWith('/output/path/source1.js', 'class Source1 -> ()')
    })
  })

  describe('Test feature to compile a directory', () => {
    beforeAll(() => {
      jest.clearAllMocks()

      lstatSyncSpy = jest.spyOn(fs, 'lstatSync')
      lstatSyncSpy.mockImplementation(() => {
        return { isDirectory: () => true }
      })

      return compiler.compile('/path/to/3files', '/output/path')
    })

    it('should set the _srcType property to dir', () => {
      expect(compiler._srcType).toEqual('dir')
    })

    it('should set the _files property to an array', () => {
      expect(compiler._files).toEqual([
        '/path/to/3files/source1.js',
        '/path/to/3files/sub/source2.js',
        '/path/to/3files/sub1/sub2/source3.js'
      ])
    })

    it('should call handle() method 3 times', () => {
      expect(compiler.handle).toHaveBeenCalledTimes(3)
      expect(compiler.handle.mock.calls).toEqual([
        ['class Source1 {}'],
        ['class Source2 {}'],
        ['class Source3 {}']
      ])
    })

    it('should read from the right filepaths', () => {
      expect(file.readString).toHaveBeenCalledTimes(3)
      expect(file.readString.mock.calls).toEqual([
        ['/path/to/3files/source1.js'],
        ['/path/to/3files/sub/source2.js'],
        ['/path/to/3files/sub1/sub2/source3.js']
      ])
    })

    it('should call fs.mkdirSync to create the output dirs for the 3 files', () => {
      expect(fs.mkdirSync).toHaveBeenCalledTimes(3)
      expect(fs.mkdirSync.mock.calls).toEqual([
        ['/output/path', { recursive: true }],
        ['/output/path/sub', { recursive: true }],
        ['/output/path/sub1/sub2', { recursive: true }]
      ])
    })

    it('should call fs.writeFileSync 3 times to write the outputs for the 3 files', () => {
      expect(fs.writeFileSync.mock.calls).toEqual([
        ['/output/path/source1.js', 'class Source1 -> ()'],
        ['/output/path/sub/source2.js', 'class Source2 -> ()'],
        ['/output/path/sub1/sub2/source3.js', 'class Source3 -> ()']
      ])
    })
  })
})
