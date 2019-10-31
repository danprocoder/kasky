const path = require('path')
const fs = require('fs')
const glob = require('glob')

/**
 * Deletes a directory with all it's content inside recursively.
 *
 * @param {string} dir Directory to delete.
 */
function deleteDir (dir) {
  const files = fs.readdirSync(dir)

  files.forEach((file) => {
    const filePath = path.join(dir, file)

    if (fs.lstatSync(filePath).isDirectory()) {
      if (fs.readdirSync(filePath).length > 0) {
        deleteDir(filePath)
      } else {
        fs.rmdirSync(filePath)
      }
    } else {
      fs.unlinkSync(filePath)
    }
  })

  fs.rmdirSync(dir)
}

function matches (pattern, callback) {
  glob(pattern, null, (err, matches) => {
    if (err) throw new Error(err)

    callback(matches)
  })
}

function readString (filepath) {
  return fs.readFileSync(filepath, { encoding: 'utf-8' })
}

module.exports = {
  deleteDir,
  matches,
  readString
}
