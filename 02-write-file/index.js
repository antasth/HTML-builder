const fs = require('fs')
const readline = require('readline')
const path = require('path')
const outputFile = fs.createWriteStream(
  path.join(__dirname, 'text.txt'),
  'utf-8'
)
const { stdin: input, stdout: output } = require('node:process')

const rl = readline.createInterface({ input, output })

const enterText = () => {
  process.on('exit', () => {
    console.log('Goodbye')
    process.exit()
  })
  rl.question('', (inputText) => {
    if (inputText === 'exit') {
      rl.close()
    } else {
      outputFile.write(inputText + '\n')
      enterText()
    }
  })
}
console.log('Hello, enter your message:')
enterText()
