const fs = require('fs-extra')
const path = require('path-extra')
const assert = require('assert')

const assets = fs.readJsonSync('assets.json')
const logos = fs.readdirSync('logos').map(p => path.base(p))

assets.forEach(asset => {
  assert(logos.includes(asset.name), `logo does not exist for ${asset.name}`)
})
