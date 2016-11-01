'use strict'
const fs = require('fs')
const chalk = require('chalk')
const rimraf = require('rimraf')

if (fs.existsSync('build/webpack.stats.json')) {
  console.log(chalk.bold.yellow('* Cleaning build folder...'))
  rimraf.sync('build')
}
