import Helmet from 'react-helmet'
import ReactDOMServer from 'react-dom/server'
import { createPrerenderer } from 'legendary-pancake/prerenderer'

import pages from './pages'

export const prerenderer = createPrerenderer(pages, {
  renderPage (content, { stylesheets, javascripts }) {
    const contentHtml = ReactDOMServer.renderToString(content)
    const head = Helmet.rewind()
    const html = `<!DOCTYPE html>
      <html ${head.htmlAttributes.toString()} >
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          ${head.title.toString()}
          ${head.meta.toString()}
          ${head.script.toString()}
          ${head.link.toString()}
          ${stylesheets}
        </head>
        <div id='app'>${contentHtml}</div>
        ${javascripts}
      </html>
    `
    return html
  }
})
