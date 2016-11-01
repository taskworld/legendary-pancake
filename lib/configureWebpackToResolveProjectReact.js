const fs = require('fs')

function configureWebpackToResolveProjectReact (config) {
  resolve('react')
  resolve('react-dom')

  return config

  function resolve (packageName) {
    const path = 'node_modules/' + packageName
    if (fs.existsSync(path)) {
      const realpath = fs.realpathSync(path)
      console.log('* Configuring webpack to use "%s" in project directory.', packageName)
      config.resolve.alias[packageName] = realpath
    }
  }
}

module.exports = configureWebpackToResolveProjectReact
