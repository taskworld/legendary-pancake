'use strict'

const fs = require('fs')

const lazy = require('./lazy')

const createResolve = (packageName) => lazy(() => {
  const path = 'node_modules/' + packageName
  if (fs.existsSync(path)) {
    const realpath = fs.realpathSync(path)
    console.log('* Configuring webpack to use "%s" in project directory.', packageName)
    return (config) => {
      config.resolve.alias[packageName] = realpath
      return config
    }
  } else {
    return (config) => config
  }
})

const resolveReact = createResolve('react')
const resolveReactDOM = createResolve('react-dom')

function configureWebpackToResolveProjectReact (config) {
  resolveReact(config)
  resolveReactDOM(config)
  return config
}

module.exports = configureWebpackToResolveProjectReact
