import fs from 'fs'
import path from 'path'
import React from 'react'

import resolvePage from './resolvePage'

// # createPrerenderer(pages, options) {#createPrerenderer}
//
// Creates a prerenderer object that can render the provided pages into static
// website.
//
// - `pages` A mapping from pathname to a page function.
//
// - `options` An [PrerendererOptions](#PrerendererOptions) object.
//
// Returns a Prerenderer. It will be used by `legendary-pancake build` command.
//
export function createPrerenderer (pages, options) {
  // ## PrerendererOptions {#PrerendererOptions}
  //
  const {
    // ### renderPage(content, renderContext)
    //
    // __Required.__ This funtion will be called during the build process
    // to generate your content pages. It will receive these arguments:
    //
    // - `content` The page content (a React node).
    //
    // - `renderContext` A RenderContext that provides additional information
    //   required to build the page.
    //
    // It should return a RenderedPage.
    //
    renderPage,

    // ### renderRedirectPage(targetPathname, renderContext)
    //
    // This funtion will be called during the build process to generate a
    // redirect file. It will receive these arguments:
    //
    // - `targetPathname` The string representing the redirection target pathname.
    //
    // - `renderContext` A RenderContext that provides additional information
    //   required to build the page.
    //
    // It should return a RenderedPage.
    //
    renderRedirectPage = defaultRenderRedirectPage
  } = options

  return { render, pathnames: Object.keys(pages) }

  function render ({ pathname, stats }, callback) {
    const page = resolvePage(pages, pathname)
    const stylesheets = createStylesheets(stats.publicPath, stats.assetsByChunkName.main)
    const javascripts = createScripts(stats.publicPath, stats.assetsByChunkName.main)

    // ## RenderContext
    //
    // A RenderContext contains additional information required to build the
    // static version of this web page.
    //
    const renderContext = {
      // ### pathname
      //
      // A string representing the pathname being built.
      //
      pathname,

      // ### stylesheets
      //
      // An array representing a list of stylesheet objects. Each object
      // contains `url` and `content` properties.
      //
      stylesheets,

      // ### javascripts
      //
      // An array representing a list of JavaScript files. Each object
      // contains `url` and `content` properties.
      //
      javascripts,

      // ### stats
      //
      // Webpack stats object.
      //
      stats
    }

    if (typeof page === 'string') {
      try {
        callback(null, renderRedirectPage(page, renderContext))
      } catch (e) {
        return callback(e)
      }
    } else {
      page((content) => {
        try {
          const element = <PageRenderer content={content} pathname={pathname} />
          const result = renderPage(element, renderContext)
          callback(null, result)
        } catch (e) {
          return callback(e)
        }
      })
    }
  }
}

class PageRenderer extends React.Component {
  static childContextTypes = {
    legendaryPancake: React.PropTypes.object
  }
  getChildContext () {
    return {
      legendaryPancake: {
        manager: {
          getContent: () => this.props.content,
          getCurrentPathname: () => this.props.pathname,
          isLoading: () => false,
          isReady: () => true
        }
      }
    }
  }
  render () {
    return this.props.content
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

// # defaultRenderRedirectPage
//
// A default implementation of renderRedirectPage option used in
// [PrerendererOptions](#PrerendererOptions).
//
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
