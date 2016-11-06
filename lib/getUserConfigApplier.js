'use strict'

const fs = require('fs')

const lazy = require('./lazy')
const webpack = require('webpack')

function getUserConfigApplier () {
  // # legendary-pancake.config.js
  //
  // The `legendary-pancake.config.js` file is read by the `legendary-pancake`
  // CLI tool and is used to configure webpack.
  //
  // It should export a configuration object, which may contain these members:
  //
  const config = require(fs.realpathSync('legendary-pancake.config.js'))

  // ## configureWebpack(config, pancake)
  //
  // legendary-pancake will use this function to let you customize the webpack
  // config. It will be given these arguments:
  //
  // - `config` The base webpack configuration. You can mutate this object directly
  //   to modify the configuration.
  //
  // - `pancake` An object with renderContext information about the build, as well as some
  //   renderContext helpers.
  //
  // It should return the modified webpack configuration.
  //
  const configureWebpack = config.configureWebpack

  const applyUserWebpackConfig = lazy(() => {
    if (configureWebpack) {
      console.log('* Using user webpack configuration.')

      // ### pancake {#config-pancake}
      //
      // The `pancake` object has these properties:
      //
      // - `webpack` The webpack module (`require('webpack')`).
      //
      // - `env` A string representing the build target.
      //
      //   - `"development"` when running the development server
      //   - `"prerenderer"` when building the prerenderer
      //   - `"production"` when building the production page
      //
      // - `css(loader)` adapts css-loader for hot-reloading (development) and extraction
      //   into a separate CSS file (build). See [CSS](css.md) page for more details.
      //
      return (webpackConfig, pancake) => (
        configureWebpack(webpackConfig, pancake) || webpackConfig
      )
    } else {
      console.log('* Using default webpack configuration.')
      console.log('  To customize, add `configureWebpack` function to `legendary-pancake.config.js`')
      return (webpackConfig, pancake) => webpackConfig
    }
  })

  // ## basePathname
  //
  // By default, legendary-pancake builds your page expecting that it will be
  // hosted on the root path.
  //
  // If that’s not the case, you need to configure `basePathname` to point to
  // the pathname where your web pages will be hosted.
  //
  // Usually, this should be the same as `config.output.publicPath` in webpack
  // configuration.
  //
  const basePathname = config.basePathname

  const configureBasePathname = lazy(() => {
    if (basePathname) {
      console.log('* Using base pathname:', basePathname)
      return useBasePathname(basePathname)
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

  // ## splitPages
  //
  // Configures whether legendary-pancake should build the HTML files into a different
  // folder from the assets folder.
  //
  // - If `false` (default), the HTML pages will be saved to `build/browser`.
  //
  //   This is the same directory as the assets. This means you can upload this
  //   directory to a static web host immediately.
  //
  // - If `true`, the HTML pages will be saved to `build/pages` instead.
  //
  //   This is useful in case the HTML files should be served by a different
  //   server, which allows for (e.g.) A/B testing and
  //   [content negotiation](https://en.wikipedia.org/wiki/Content_negotiation).
  //
  const splitPages = config.splitPages

  // ## developmentTemplateFile
  //
  // Specifies the template file to use when running the development server.
  // This template will be passed to [HtmlWebpackPlugin](https://github.com/ampedandwired/html-webpack-plugin).
  // Defaults to `./src/dev.html`.
  //
  const developmentTemplateFile = config.developmentTemplateFile || './src/dev.html'

  // ## browserEntryFile
  //
  // Specifies the file to be used as browser entry point.
  // Defaults to `./src/browser.js`.
  //
  const browserEntryFile = config.browserEntryFile || './src/browser.js'

  // ## prerendererEntryFile
  //
  // Specifies the file to be used as prerenderer.
  // Defaults to `./src/prerenderer.js`.
  //

  return {
    applyWebpackConfig: (webpackConfig, options) => {
      webpackConfig = applyUserWebpackConfig(webpackConfig, options) || webpackConfig
      webpackConfig = configureBasePathname(webpackConfig) || webpackConfig
      return webpackConfig
    },
    shouldSplitPages: () => !!splitPages,
    getDevelopmentTemplateFile: () => developmentTemplateFile,
    getBrowserEntryFile: () => browserEntryFile
  }
}

module.exports = getUserConfigApplier
