'use strict'

const path = require('path')
const webpack = require('../../node_modules/webpack')

exports.basePathname = '/legendary-pancake/'

exports.configureWebpack = (config, { css }) => {
  config.module.rules.push(
    {
      test: /\.js$/,
      include: path.join(__dirname, 'src'),
      loader: 'babel-loader'
    },
    {
      test: /\.css$/,
      loader: css('css-loader')
    },
    {
      test: /\.less$/,
      loader: css('css-loader!less-loader')
    },
    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader'
    },
    {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader'
    },
    {
      test: /\.jpg$/,
      loader: 'file-loader'
    }
  )
  config.output.publicPath = '/legendary-pancake/'
  config.plugins.push(
    new webpack.LoaderOptionsPlugin({
      test: /\.md$/,
      options: {
        'markdown-it': {
          typographer: true,
          use: [ require('markdown-it-attrs') ]
        }
      }
    })
  )
  return config
}
