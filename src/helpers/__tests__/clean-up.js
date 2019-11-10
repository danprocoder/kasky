const cleanUp = require('../clean-up')
const file = require('../file')

jest.mock('../file')

describe('Test cleanUp helper', () => {
  afterAll(() => {
    cleanUp.filesToCleanUp = []
    jest.restoreAllMocks()
  })

  it('should add a dir', () => {
    cleanUp.addDir('some/dir')
    expect(cleanUp.filesToCleanUp).toEqual(['some/dir'])
  })

  it('should add another dir', () => {
    cleanUp.addDir('some/other/dir')
    expect(cleanUp.filesToCleanUp).toEqual(['some/dir', 'some/other/dir'])
  })

  it('should call helper method to delete dirs', () => {
    cleanUp.cleanUp()
    expect(file.deleteDir).toHaveBeenCalledTimes(
      cleanUp.filesToCleanUp.length
    )
    expect(file.deleteDir.mock.calls).toEqual([
      ['some/dir'],
      ['some/other/dir']
    ])
  })
})
