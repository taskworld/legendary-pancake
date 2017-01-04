import { createRenderer } from 'legendary-pancake'
import pages from './pages'

const app = document.getElementById('app')

// Creates a page renderer, which manages React and React Router for us.
// It also makes sure to load the initial route before mounting.
const renderer = createRenderer(pages, {
  onLocationChange (location) {
    console.log('%cPageview: %c%s',
      'font: 30px Comic Sans MS, Chalkboard, cursive',
      'font: bold 30px Comic Sans MS, Chalkboard, cursive',
      location.pathname
    )
  }
})
renderer.renderTo(app)

// Bridge with hot reloading API.
if (module.hot) {
  const onHotReload = renderer.createHotReloadHandler(() => require('./pages').default)
  module.hot.accept('./pages', onHotReload)
}
