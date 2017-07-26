const fs = require('fs-extra')
const enquirer = new (require('enquirer'))()

enquirer.register('boolean', require('prompt-confirm'))

const questions = [
  'name',
  'properName',
  { name: 'available', type: 'boolean' },
  'decimals',
  'displayUnit',
  'shapeShiftUnit',
  'blockExplorer',
  'contractAddress',
  'color'
].map(q => {
  if (typeof q === 'object') {
    q.message = q.name
    return q
  }
  return { name: q, message: q }
})

Promise.all([
  fs.readJson('assets.json'),
  enquirer.ask(questions)
])
  .then(([jsonData, answers]) => {
    // Validation:
    if (jsonData.some(item => item.contractAddress === answers.contractAddress)) {
      throw new Error(`asset with contractAddress: ${answers.contractAddress} already exists`)
    }
    if (Object.keys(answers).length !== 9) throw new Error('Some fields missing')
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
