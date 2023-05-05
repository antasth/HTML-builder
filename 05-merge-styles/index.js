let fs = require('fs')
const path = require('path')
const dirPath = path.join(__dirname, 'styles')
const bundle = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
  'utf-8'
)

const mergeStyles = (dir) => {
  fs.readdir(dir, (error, files) => {
    if (error) throw error

    files.forEach((file) => {
      let filePath = path.join(dir, file)
      fs.stat(filePath, (error, stats) => {
        if (error) throw error
        if (stats.isFile() && path.extname(file) === '.css') {
          fs.readFile(filePath, 'utf-8', (error, data) => {
            if(error) throw error
            bundle.write(data)
            bundle.write('\n')
          })
        }
      })
    })
  })
}

mergeStyles(dirPath)
