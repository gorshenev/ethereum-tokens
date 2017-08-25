const fs = require('fs-extra')
const enquirer = new (require('enquirer'))()

const questions = [
  'name',
  'properName',
  'decimals',
  'displayUnit',
  'shapeShiftUnit',
  'blockExplorer',
  'contractAddress',
  'color'
]

Promise.all([
  fs.readJson('assets.json'),
  enquirer.ask(questions)
])
  .then(([jsonData, answers]) => {
    // Validation:
    if (jsonData.some(item => item.contractAddress === answers.contractAddress)) {
      throw new Error(`asset with contractAddress: ${answers.contractAddress} already exists`)
    }
    if (Object.keys(answers).length !== questions.length) throw new Error('Some fields missing')
    answers.decimals = Number(answers.decimals)
    if (Number.isNaN(answers.decimals)) throw new Error('Invalid `decimals` entered')
    if (answers.color[0] !== '#') answers.color = `#${answers.color}`

    console.log(JSON.stringify(answers, null, 2))

    const newData = jsonData.concat(answers).sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })

    return fs.writeJson('assets.json', newData, { spaces: 2 })
  })
  .then(() => console.warn('done'))
  .catch(console.error)
