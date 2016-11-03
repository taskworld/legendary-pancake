'use strict'

const fs = require('fs')
const path = require('path')
const bytes = require('bytes')
const chalk = require('chalk')
const mkdirp = require('mkdirp')
const getUserConfigApplier = require('../lib/getUserConfigApplier')

function prerenderPages () {
  const userConfig = getUserConfigApplier()
  const targetDirectory = path.join(
    'build',
    userConfig.shouldSplitPages() ? 'pages' : 'browser'
  )
  console.log(chalk.bold.cyan('* Prerendering web pages to %s.'), targetDirectory)
  const {
    pathnames,
    render
  } = require(fs.realpathSync('build/prerenderer/prerenderer.js')).prerenderer
  const stats = require(fs.realpathSync('build/webpack.stats.browser.json'))
  const promises = [ ]
  for (const pathname of pathnames) {
    promises.push(new Promise((resolve, reject) => {
      render({ pathname, stats }, (error, html) => {
        if (error) {
          console.log(error)
          return reject(error)
        }
        if (typeof html === 'string') {
          emit({ [pathname]: html })
        } else {
          emit(html)
        }
        resolve()
      })
    }))
  }
  return Promise.all(promises)

  function emit (files) {
    for (const pathname of Object.keys(files)) {
      const filename = (targetDirectory + '/' + pathname.replace(/^\/+/, '')).replace(/\/$/, '/index.html')
      const parent = path.dirname(filename)
      if (!fs.existsSync(parent)) mkdirp.sync(parent)
      const buffer = new Buffer(files[pathname], 'utf8')
      fs.writeFileSync(filename, buffer)
      console.log('* Written %s (%s)', filename, bytes(buffer.length))
    }
  }
}

prerenderPages().then(
  (results) => {
    console.log(chalk.bold.green('* Prerendered %s pages.'), results.length)
  },
  (error) => {
    console.log(chalk.bold.red('* Failed to prerender some pages...'))
    setTimeout(() => { throw error })
  }
)
