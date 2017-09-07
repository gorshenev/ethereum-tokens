'use strict'
const fs = require('fs-extra')
const path = require('path')
const Enquirer = require('enquirer')

const assetsFile = path.join(__dirname, '..', 'assets.json')
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
  fs.readJson(assetsFile),
  new Enquirer().ask(questions)
])
  .then(([assets, answers]) => {
    // Validation:
    if (assets.some((item) => item.contractAddress === answers.contractAddress)) {
      throw new Error(`asset with contractAddress: ${answers.contractAddress} already exists`)
    }
    if (Object.keys(answers).length !== questions.length) throw new Error('Some fields missing')
    answers.decimals = Number(answers.decimals)
    if (!Number.isFinite(answers.decimals)) throw new Error('Invalid `decimals` entered')
    if (answers.color[0] !== '#') answers.color = `#${answers.color}`

    console.log(JSON.stringify(answers, null, 2))

    const newData = assets.concat(answers).sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })

    return fs.writeJson(assetsFile, newData, { spaces: 2 })
  })
  .then(() => console.warn('done'), console.error)
