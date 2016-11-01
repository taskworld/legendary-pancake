'use strict'

module.exports = function lazy (factory) {
  let instance
  return function () {
    if (!instance) {
      instance = factory()
    }
    return instance.apply(this, arguments)
  }
}
