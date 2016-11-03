'use strict'

const fs = require('fs')
const assert = require('assert')

/* global describe, it */

describe('webpack stats', () => {
  exists('build/webpack.stats.browser.json')
  exists('build/webpack.stats.prerenderer.json')
})

describe('generated pages', () => {
  exists('build/pages/index.html')
  contains('build/pages/index.html', 'page title', 'Home page - legendary-pancake')
  contains('build/pages/index.html', 'rendered content', 'static site builder based on React')
  contains('build/pages/index.html', 'google fonts as preload assets', 'rel="preload"')
  contains('build/pages/index.html', 'loadCSS inlined', 'loadCSS')
  contains('build/pages/index.html', 'css rel="preload" polyfill inlined', 'supports("preload")')
  contains('build/pages/index.html', 'css inlined', 'necolas/normalize.css')
  contains('build/pages/index.html', 'script tag that loads the bundle', '.js\'></SCRIPT>')
  contains('build/pages/introduction/index.html', 'markdown rendered content', 'Need inspiration?')
  contains('build/pages/readme/index.html', 'redirect to correct path', '"/legendary-pancake/introduction/"')
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
