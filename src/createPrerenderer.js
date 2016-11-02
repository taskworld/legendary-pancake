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
    const stylesheets = createStyleString(stats.publicPath, stats.assetsByChunkName.main)
    const javascripts = createScriptString(stats.publicPath, stats.assetsByChunkName.main)
    if (typeof page === 'string') {
      try {
        callback(null, renderRedirectPage(page))
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
            const result = renderPage(<RouterContext {...renderProps} />, {
              pathname,
              stylesheets,
              javascripts,
              stats
            })
            callback(null, result)
          } catch (e) {
            return callback(e)
          }
        })
      })
    }
  }
}

function createStyleString (publicPath, assets) {
  let stylesheets = assets.filter((file) => {
    return /\.css$/.test(file)
  })
  return stylesheets.map((file) =>
    `<LINK HREF='${publicPath}${file}' REL='stylesheet' />`
  ).join('')
}

function createScriptString (publicPath, assets) {
  let scripts = assets.filter((file) => {
    return /\.js/.test(file)
  })
  return scripts.map((file) =>
    `<SCRIPT SRC='${publicPath}${file}'></SCRIPT>`
  ).join('')
}

export function defaultRenderRedirectPage (redirectLocation) {
  /* global __legendary_pancake_base_pathname__ */
  const base = __legendary_pancake_base_pathname__
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
