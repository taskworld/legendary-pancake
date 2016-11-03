import fs from 'fs'
import path from 'path'
import React from 'react'
import { createMemoryHistory, match, RouterContext, Route } from 'react-router'

import resolvePage from './resolvePage'

export function createPrerenderer (pages, {
  renderPage,
  renderRedirectPage = defaultRenderRedirectPage
}) {
  return { render, pathnames: Object.keys(pages) }

  function render ({ pathname, stats }, callback) {
    const history = createMemoryHistory()
    const location = history.createLocation(pathname)
    const page = resolvePage(pages, pathname)
    const stylesheets = createStylesheets(stats.publicPath, stats.assetsByChunkName.main)
    const javascripts = createScripts(stats.publicPath, stats.assetsByChunkName.main)
    const renderOptions = { pathname, stylesheets, javascripts, stats }
    if (typeof page === 'string') {
      try {
        callback(null, renderRedirectPage(page, renderOptions))
      } catch (e) {
        return callback(e)
      }
    } else {
      page((content) => {
        const PageRenderer = () => content
        const routes = <Route path={pathname} component={PageRenderer} />
        match({ routes, location }, (error, redirectLocation, renderProps) => {
          if (error) {
            return callback(error)
          }
          if (!renderProps) {
            return callback(new Error('react-router did not send renderProps!!!!!'))
          }
          try {
            const result = renderPage(<RouterContext {...renderProps} />, renderOptions)
            callback(null, result)
          } catch (e) {
            return callback(e)
          }
        })
      })
    }
  }
}

function toAsset (publicPath) {
  return (assetPath) => {
    let fileContent = null
    return {
      url: `${publicPath}${assetPath}`,
      get content () {
        if (fileContent == null) {
          fileContent = fs.readFileSync(path.join('build', 'browser', assetPath), 'utf8')
        }
        return fileContent
      }
    }
  }
}

function createStylesheets (publicPath, assets) {
  const stylesheets = (coerceToArray(assets)
    .filter((file) => /\.css$/.test(file))
    .map(toAsset(publicPath))
  )
  stylesheets.toString = () => (stylesheets
    .map(({ url }) => `<LINK HREF='${url}' REL='stylesheet' />`)
    .join('')
  )
  return stylesheets
}

function createScripts (publicPath, assets) {
  const javascripts = (coerceToArray(assets)
    .filter((file) => /\.js/.test(file))
    .map(toAsset(publicPath))
  )
  javascripts.toString = () => (javascripts
    .map(({ url }) => `<SCRIPT SRC='${url}'></SCRIPT>`)
    .join('')
  )
  return javascripts
}

function coerceToArray (maybeArray) {
  return Array.isArray(maybeArray) ? maybeArray : [ maybeArray ]
}

export function defaultRenderRedirectPage (redirectLocation) {
  /* global __legendary_pancake_base_pathname__ */
  const base = __legendary_pancake_base_pathname__ // eslint-disable-line camelcase
  const url = base + redirectLocation
  return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Redirect</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="refresh" content="0;url=${url}">
      </head>
      <body>
        <span style="font: caption">
          If you are not redirected automatically, <a href='${url}'>follow the link to ${url}</a>.
        </span>
        <SCRIPT>window.location.replace(${JSON.stringify(url)})</SCRIPT>
      </body>
    </html>
  `
}

export default createPrerenderer
