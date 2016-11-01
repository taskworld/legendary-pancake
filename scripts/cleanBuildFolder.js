'use strict'
const rimraf = require('rimraf')
const fs = require('fs')

if (fs.existsSync('build/webpack.stats.json')) {
  rimraf.sync('build')
}
