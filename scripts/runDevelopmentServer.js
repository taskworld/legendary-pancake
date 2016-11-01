'use strict'

const path = require('path')
const chalk = require('chalk')
const express = require('express')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const getUserConfigApplier = require('../lib/getUserConfigApplier')
const port = +process.env.PORT || 9000

console.log(chalk.bold.cyan('* Running development server on port %s.'), port)
console.log('* To change port, please set the PORT environment variable.')

const app = express()
const config = getConfig()
const compiler = webpack(config)

let displayed = false
compiler.plugin('done', (stats) => {
  if (!displayed) {
    displayed = true
    console.log(chalk.bold.green('* Preview at:'), `http://localhost:${port}/`)
  }
})

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: { colors: true }
}))

app.use(require('webpack-hot-middleware')(compiler))
app.use(require('connect-history-api-fallback')())
app.listen(port)

function getConfig () {
  const projectDirectory = process.cwd()
  const userConfigApplier = getUserConfigApplier()

  const config = {
    entry: {
      main: './src/browser.js'
    },

    output: {
      publicPath: '/',
      path: path.join(projectDirectory, 'build', 'browser'),
      filename: 'assets/javascripts/bundle.js',
      chunkFilename: 'assets/javascripts/chunk-[name]-[chunkhash].js'
    },

    module: {
      loaders: [
      ]
    },

    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({ template: './src/index.html' }),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('development')
        }
      })
    ]
  }

  return userConfigApplier.applyWebpackConfig(config, {
    webpack,
    target: 'browser',
    env: 'production',
    css: (loaders) => 'style-loader!' + loaders
  })
}
