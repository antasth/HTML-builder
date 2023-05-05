let fs = require('fs')
const fsPromises = fs.promises
const path = require('path')
const dirPath = path.join(__dirname, 'files')
const dirCopyPath = path.join(__dirname, 'files-copy')

const clearFolder = (dir) => {
  fs.readdir(dir, (error, files) => {
    if (error) throw error
    files.forEach((file) => {
      let filePath = path.join(dir, file)
      fs.unlink(filePath, (error) => {
        if (error) throw error
      })
    })
  })
}
const copyFiles = (pathFrom, pathTo) => {
  fs.readdir(pathFrom, (error, files) => {
    if (error) throw error

    files.forEach((file) => {
      let filePath = path.join(pathFrom, file)
      fs.stat(filePath, (error, stats) => {
        if (error) throw error
        if (stats.isFile()) {
          fs.copyFile(
            path.join(pathFrom, file),
            path.join(pathTo, file),
            (error) => {
              if (error) throw error
            }
          )
        }
      })
    })
  })
}

fsPromises
  .mkdir(dirCopyPath, { recursive: true })
  .then(function () {
    clearFolder(dirCopyPath)
    copyFiles(dirPath, dirCopyPath)
  })
  .catch(function () {
    console.log('failed to create directory')
  })
