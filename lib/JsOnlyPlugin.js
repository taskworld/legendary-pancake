function JsOnlyPlugin () {
}
JsOnlyPlugin.prototype.apply = function (compiler) {
  compiler.plugin('emit', function (compilation, callback) {
    const assets = compilation.assets
    const keysToRemove = Object.keys(assets).filter(key => !/\.js$/.test(key))
    for (const keyToRemove of keysToRemove) {
      delete assets[keyToRemove]
    }
    callback()
  })
}

module.exports = JsOnlyPlugin
