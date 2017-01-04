'use strict'
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const JsOnlyPlugin = require('../lib/JsOnlyPlugin')
const getUserConfigApplier = require('../lib/getUserConfigApplier')
const configureWebpackToResolveProjectReact = require('../lib/configureWebpackToResolveProjectReact')

console.log(chalk.bold.cyan('* Building webpack bundles...'))

const config = getConfig()

webpack(config).run((error, webpackStats) => {
  if (error) {
    throw error
  }
  const stats = webpackStats.toJson()

  writeStats(stats.children[0], path.join('build', 'webpack.stats.browser.json'))
  writeStats(stats.children[1], path.join('build', 'webpack.stats.prerenderer.json'))

  if (stats.warnings.length) {
    console.log(chalk.bold.yellow('* There are %s warnings.'), stats.warnings.length)
  }

  if (stats.errors.length) {
    console.log(chalk.bold.red('* There are %s errors.'), stats.errors.length)
    for (const error of stats.errors) {
      console.log('-'.repeat(80))
      console.log(error)
    }
    throw new Error('There are errors in webpack.')
  }

  console.log(chalk.bold.green('* webpack bundles built succesfully!'))
})

function writeStats (stats, target) {
  console.log('* Writing webpack stats to ' + target)
  fs.writeFileSync(target, JSON.stringify(stats))
}

function getConfig () {
  const projectDirectory = process.cwd()
  const userConfigApplier = getUserConfigApplier()

  return [
    getBrowserConfig(),
    getPrerendererConfig()
  ]

  function getBrowserConfig () {
    const extractTextPlugin = new ExtractTextPlugin({
      filename: 'assets/stylesheets/style-[contenthash].css',
      allChunks: true
    })

    const config = {
      entry: {
        main: userConfigApplier.getBrowserEntryFile()
      },
      output: {
        publicPath: '/',
        path: path.join(projectDirectory, 'build', 'browser'),
        filename: 'assets/javascripts/bundle-[chunkhash].js',
        chunkFilename: 'assets/javascripts/chunk-[name]-[chunkhash].js'
      },
      module: {
        rules: [ ]
      },
      resolve: {
        alias: { }
      },
      profile: true,
      plugins: [
        extractTextPlugin,
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('production')
          }
        })
      ]
    }
    if (!process.env.NO_UGLIFY) {
      config.plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }))
    }

    configureWebpackToResolveProjectReact(config)

    return userConfigApplier.applyWebpackConfig(config, {
      webpack,
      env: 'production',
      css: (loaders) => extractTextPlugin.extract(loaders)
    })
  }

  function getPrerendererConfig () {
    const extractTextPlugin = new ExtractTextPlugin({
      filename: 'assets/stylesheets/style-[contenthash].css',
      allChunks: true
    })

    const config = {
      entry: {
        prerenderer: userConfigApplier.getPrerendererEntryFile()
      },
      output: {
        publicPath: '/',
        path: path.join(projectDirectory, 'build', 'prerenderer'),
        filename: 'prerenderer.js',
        chunkFilename: 'chunk-[name].js',
        libraryTarget: 'commonjs2'
      },
      target: 'node',
      module: {
        rules: [ ]
      },
      resolve: {
        alias: { }
      },
      plugins: [
        extractTextPlugin,
        new JsOnlyPlugin(),
        new webpack.DefinePlugin({
          'process.env': {
            'NODE_ENV': JSON.stringify('prerenderer')
          }
        })
      ]
    }

    configureWebpackToResolveProjectReact(config)

    return userConfigApplier.applyWebpackConfig(config, {
      webpack,
      env: 'prerenderer',
      css: (loaders) => extractTextPlugin.extract(loaders)
    })
  }
}
