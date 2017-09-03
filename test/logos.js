'use strict'
const test = require('tape')
const fs = require('fs')
const path = require('path')
const assets = require('../assets.json')

test('logos', (t) => {
  for (const asset of assets) {
    t.true(fs.existsSync(path.join(__dirname, '..', 'logos', asset.name + '.png')), `${asset.name} logo exists`)
  }

  t.end()
})
