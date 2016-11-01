'use strict'

const fs = require('fs')

const lazy = require('./lazy')

function getUserConfigApplier () {
  const config = require(fs.realpathSync('legendary-pancake.config.js'))
  const applyWebpackConfig = lazy(() => {
    if (config.configureWebpack) {
      console.log('* Using user webpack configuration.')
      return config.configureWebpack
    } else {
      console.log('* Using default webpack configuration.')
      console.log('  To customize, add `configureWebpack` function')
      console.log('  to `legendary-pancake.config.js`')
      return (webpackConfig) => webpackConfig
    }
  })
  return {
    applyWebpackConfig
  }
}

module.exports = getUserConfigApplier
