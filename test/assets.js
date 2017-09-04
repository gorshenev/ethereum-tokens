'use strict'
const test = require('tape')
const eUtil = require('ethereumjs-util')
const fetch = require('node-fetch')
const assets = require('../')

test('assets', (t) => {
  fetch('https://shapeshift.io/getcoins').then((res) => res.json()).then((coins) => {
    for (const asset of assets) {
      t.test(`validate ${asset.name}`, (t) => {
        const checkSProp = (prop) => t.true(typeof asset[prop] === 'string' && asset[prop].length > 0, `checking ${prop}`)

        checkSProp('name')
        checkSProp('properName')
        t.true(Number.isFinite(asset.decimals) && asset.decimals > 0, 'checking decimals')
        checkSProp('displayUnit')
        t.true(typeof asset.shapeShiftUnit === 'string', 'checking shapeShiftUnit')
        checkSProp('blockExplorer')
        t.true(eUtil.isValidChecksumAddress(asset.contractAddress), 'checking contractAddress')
        t.true(/#[0-9A-F]{6}/.test(asset.color), 'checking color')

        if (asset.shapeShiftUnit !== '') {
          const coin = coins[asset.shapeShiftUnit.toUpperCase()]
          t.ok(coin, 'shapeShiftUnit should exist')
        }

        t.end()
      })
    }

    t.end()
  })
})
