let fs = require('fs')
const path = require('path')
const dirPath = path.join(__dirname, 'secret-folder')

const getFilesInfo = (dir) => {
  fs.readdir(dir, (error, files) => {
    if (error) throw error

    files.forEach((file) => {
      let filePath = path.join(dir, file)
      fs.stat(filePath, (error, stats) => {
        if (error) throw error
        if (stats.isFile()) {
          console.log(
            file.replace('.', ' - '),
            '-',
            (stats.size / 1024),
            'kb'
          )
        }
      })
    })
  })
}
getFilesInfo(dirPath)
