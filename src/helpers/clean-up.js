const fileHelper = require('./file')

module.exports = {
  filesToCleanUp: [],

  addDir (pathToClean) {
    this.filesToCleanUp.push(pathToClean)
  },

  cleanUp () {
    this.filesToCleanUp.forEach((dir) => {
      fileHelper.deleteDir(dir)
    })
  }
}
