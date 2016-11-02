'use strict'

const fs = require('fs')

const lazy = require('./lazy')
const webpack = require('webpack')

function getUserConfigApplier () {
  const config = require(fs.realpathSync('legendary-pancake.config.js'))

  const configureBasePathname = lazy(() => {
    if (config.basePathname) {
      console.log('* Using base pathname:', config.basePathname)
      return useBasePathname(config.basePathname)
    } else {
      console.log('* Assuming that the site will be hosted at pathname "/".')
      console.log('  To customize, add `basePathname` option in `legendary-pancake.config.js`')
      return useBasePathname('/')
    }

    function useBasePathname (basePathname) {
      if (!basePathname.startsWith('/')) {
        throw new Error('Expected basePathname to begin with /')
      }
      basePathname = basePathname.replace(/\/$/, '')
      return (webpackConfig) => {
        webpackConfig.plugins.push(new webpack.DefinePlugin({
          '__legendary_pancake_base_pathname__': JSON.stringify(basePathname)
        }))
        return webpackConfig
      }
    }
  })

  const configureWebpack = lazy(() => {
    if (config.configureWebpack) {
      console.log('* Using user webpack configuration.')
      return config.configureWebpack
    } else {
      console.log('* Using default webpack configuration.')
      console.log('  To customize, add `configureWebpack` function to `legendary-pancake.config.js`')
      return (webpackConfig) => webpackConfig
    }
  })

  return {
    applyWebpackConfig: (config, options) => {
      config = configureWebpack(config, options) || config
      config = configureBasePathname(config) || config
      return config
    }
  }
}

module.exports = getUserConfigApplier
