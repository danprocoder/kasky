const path = require('path');
const fs = require('fs');

/**
 * Deletes a directory with all it's content inside recursively.
 * 
 * @param {string} dir Directory to delete.
 */
function deleteDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);

    if (fs.lstatSync(filePath).isDirectory()) {
      if (fs.readdirSync(filePath).length > 0) {
        deleteDir(filePath);
      } else {
        fs.rmdirSync(filePath);
      }
    } else {
      fs.unlinkSync(filePath);
    }
  });

  fs.rmdirSync(dir);
};

exports.deleteDir = deleteDir;
