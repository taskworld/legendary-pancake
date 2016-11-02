'use strict'

const fs = require('fs')
const assert = require('assert')

/* global describe, it */

describe('webpack stats', () => {
  exists('build/webpack.stats.json')
})

describe('generated pages', () => {
  exists('build/pages/index.html')
  contains('build/pages/index.html', 'page title', 'Home page - legendary-pancake')
  contains('build/pages/index.html', 'rendered content', 'static site builder based on React')
  contains('build/pages/docs/index.html', 'markdown rendered content', 'Need inspiration?')
})

function exists (path) {
  it(`${path} exists`, () => {
    assert(fs.existsSync(path), `${path} must exist`)
  })
}

function contains (path, thing, value) {
  it(`${path} contains ${thing} (${value})`, () => {
    assert(fs.readFileSync(path, 'utf8').includes(value), `${path} must contain ${value}`)
  })
}
