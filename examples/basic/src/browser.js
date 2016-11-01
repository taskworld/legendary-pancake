import { createRenderer } from 'legendary-pancake'

import pages from './pages'

const app = document.getElementById('app')
const renderer = createRenderer(pages)
renderer.renderTo(app)

if (module.hot) {
  module.hot.accept('./pages', renderer.createHotReloadHandler(() => require('./pages').default))
}
