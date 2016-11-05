'use strict'

const fs = require('fs')

module.exports = function (content) {
  const callback = this.async()

  require('string-replace-async')(
    content.toString(),
    /\{%\s*include_comments\s+(\S+)\s*%\}/g,
    (all, request) => new Promise((resolve, reject) => {
      this.resolve(this.context, request, (err, targetFile) => {
        if (err) return reject(err)
        this.addDependency(targetFile)
        fs.readFile(targetFile, 'utf8', (err, source) => {
          if (err) return reject(err)
          const lines = source.split('\n')
          const result = (lines
            .map((line) => {
              const match = line.match(/^\s*\/\/[ ]?(.*)/)
              if (match) {
                return { text: match[1] }
              }
            })
            .filter((x) => x)
            .filter((line) => !/^\-\-/.test(line.text))
            .map((line) => line.text)
            .join('\n')
          )
          resolve(result)
        })
      })
    })
  )
  .then(
    (result) => callback(null, result),
    (error) => callback(error)
  )
}
