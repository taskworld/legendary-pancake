'use strict'

const fs = require('fs')
const path = require('path')
const bytes = require('bytes')
const chalk = require('chalk')
const mkdirp = require('mkdirp')

function prerenderPages () {
  console.log(chalk.bold.cyan('* Prerendering web pages.'))
  const { pages, render, renderRedirectPage } = require(fs.realpathSync('build/prerenderer/prerenderer.js'))
  const webpackStats = require(fs.realpathSync('build/webpack.stats.json'))
  const pathnames = Object.keys(pages)
  const stats = webpackStats.children[0]
  const promises = [ ]
  for (const pathname of pathnames) {
    promises.push(new Promise((resolve, reject) => {
      const page = pages[pathname]
      const receiveResult = (error, html) => {
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
      }
      if (typeof page === 'function') {
        page((content) => {
          render({ pathname, content, stats }, receiveResult)
        })
      } else if (typeof page === 'string') {
        renderRedirectPage({ pathname, redirectLocation: page, stats }, receiveResult)
      }
    }))
  }
  return Promise.all(promises)
}

function emit (files) {
  for (const pathname of Object.keys(files)) {
    const filename = (path.join('build', 'pages') + '/' + pathname.replace(/^\/+/, '')).replace(/\/$/, '/index.html')
    const parent = path.dirname(filename)
    if (!fs.existsSync(parent)) mkdirp.sync(parent)
    const buffer = new Buffer(files[pathname], 'utf8')
    fs.writeFileSync(filename, buffer)
    console.log('* Written %s (%s)', filename, bytes(buffer.length))
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
