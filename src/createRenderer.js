import { rebasePathname, stripBasenameFromPathname } from './PathUtils'

import PropTypes from 'prop-types'
import React from 'react'
import { createStore } from 'redux'
import { render } from 'react-dom'
import resolvePage from './resolvePage'

// # createRenderer(pages, options) {#createRenderer}
//
// Creates a renderer object that can render the provided pages into the DOM.
//
// - `pages` A mapping from pathname to a page function.
//
// - `options` An [RendererOptions](#RendererOptions) object.
//
// Returns a [Renderer](#Renderer).
//
export function createRenderer (pages, options = { }) {
  const manager = createManager()
  const scrollRestorationStorage = { }

  let dirty = false // for hot reloading

  // ## RendererOptions {#RendererOptions}
  //
  const {
    // ### renderPage(page)
    //
    // This function will be called prior to rendering the page. It will receive
    // the page content (a React node) and should return what should be rendered
    // (a React node).
    //
    // Default is an identity function. But you can customize this function
    // if you want to add contexts.
    //
    renderPage = (page) => page,

    // ### onLocationChange(location)
    //
    // This function will be called when the location changes. Useful for
    // tracking analytic pageviews.
    //
    // Default is a no-op function.
    //
    onLocationChange = (location) => { },

    // ### shouldUpdateScroll(prevPathname, nextPathname)
    //
    // This function will be called when the route changed.
    // If it returns `true`, the page will be scrolled to the top.
    // Useful for custom scroll behaviours on page change.
    //
    // Default is a function that always returns true.
    //
    shouldUpdateScroll = (prevPathname, nextPathname) => true
  } = options

  const componentContext = {
    manager,
    go (targetPathname) {
      if (!window.history.pushState) {
        window.location.href = rebasePathname(targetPathname)
        return
      }
      const currentPathname = manager.getCurrentPathname()
      window.history.pushState(null, null, rebasePathname(targetPathname))
      loadPageFromLocation(() => {
        if (!window.location.hash) {
          if (shouldUpdateScroll(currentPathname, targetPathname)) {
            window.scrollTo(0, 0)
          }
        }
      })
    },
    pathnameExists (pathname) {
      return !!pages[pathname]
    }
  }

  // -- This component subscribes to the manager and renders its content.
  class PageRenderer extends React.Component {
    constructor (props) {
      super(props)
      this.state = { content: manager.getContent() }
      this.unsubscribe = manager.subscribe(() => {
        const content = manager.getContent()
        this.setState({ content })
      })
    }
    shouldComponentUpdate (nextProps, nextState) {
      return this.state.content !== nextState.content
    }
    getChildContext () {
      return { legendaryPancake: componentContext }
    }
    componentWillUnmount () {
      this.unsubscribe()
    }
    render () {
      return renderPage(this.state.content)
    }
  }
  PageRenderer.childContextTypes = {
    legendaryPancake: PropTypes.object
  }

  function handlePathname (pathname, onFinish) {
    const nextPage = resolvePage(pages, pathname)
    if (typeof nextPage === 'string') {
      window.history.replaceState(null, null, rebasePathname(nextPage))
      return handlePathname(nextPage)
    }
    if (pathname === manager.getCurrentPathname()) {
      if (!dirty) return
      dirty = false
    }
    let loaded = false
    let asynchronously = false
    nextPage((nextContent) => {
      manager.handleContentLoaded(pathname, nextContent, { asynchronously })
      loaded = true
      if (onFinish) onFinish()
    })
    if (!loaded) {
      manager.handleContentLoadStarted(pathname)
      asynchronously = true
    }
    onLocationChange({ pathname })
  }

  let previousRestorationId = null
  function loadPageFromLocation (onFinish) {
    const restorationId = (() => {
      if (!window.history.state) {
        const newId = generateNewRestorationId()
        if (window.history.replaceState) {
          const state = { restorationId: newId }
          window.history.replaceState(state, null, window.location.href)
        }
        return newId
      } else {
        return window.history.state.restorationId
      }
    })()
    const pathname = stripBasenameFromPathname(window.location.pathname)
    handlePathname(pathname, () => {
      if (onFinish) onFinish()
      if (manager.getCurrentPathname() === pathname) {
        if (previousRestorationId !== restorationId) {
          const state = scrollRestorationStorage[restorationId]
          const position = state && state.scrollPosition
          if (position) {
            window.scrollTo(position[0], position[1])
          }
        }
      }
    })
  }

  loadPageFromLocation()

  window.addEventListener('popstate', () => {
    loadPageFromLocation()
  })

  window.addEventListener('scroll', () => {
    const state = window.history.state
    const id = state && state.restorationId
    if (!id) return
    scrollRestorationStorage[id] = {
      scrollPosition: [ window.scrollX, window.scrollY ]
    }
  })

  function replacePages (nextPages) {
    pages = nextPages
    dirty = true
    loadPageFromLocation()
  }

  // ## Renderer {#Renderer}
  //
  // Created by [createRenderer](#createRenderer)().
  //
  return {
    // ### renderTo(container)
    //
    // Renders the static site into the DOM.
    //
    // * `container` A DOM element to render the site to.
    //
    // It will load the first page content before mounting the React Router.
    //
    renderTo (container) {
      // Wait for manager to be ready...
      const unsubscribe = manager.subscribe(handleManagerStateChange)
      handleManagerStateChange()

      function handleManagerStateChange () {
        if (manager.isReady()) {
          unsubscribe()
          renderPage()
        }
      }

      function renderPage () {
        render(<PageRenderer />, container)
      }
    },

    // ### createHotReloadHandler(getPages)
    //
    // Creates a hot reload handler suitable for using with `module.hot.accept`.
    //
    // See [Getting Started](./getting-started.md) guide for example.
    //
    createHotReloadHandler (getPages) {
      return () => replacePages(getPages())
    }
  }
}

function generateNewRestorationId () {
  return Date.now() + ':' + Math.random()
}

// -- Creates a content manager which stores the content to render.
function createManager () {
  const INITIAL_STATE = {
    content: null,
    loading: true,
    currentPathname: null,
    nextPathname: null
  }

  const store = createStore(reducer)

  function reducer (state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'CONTENT_LOADED':
        if (!action.asynchronously || action.pathname === state.nextPathname) {
          return {
            content: action.content,
            loading: false,
            currentPathname: action.pathname,
            nextPathname: null
          }
        } else {
          return state
        }
      case 'CONTENT_LOAD_STARTED':
        return {
          content: state.content,
          loading: true,
          currentPathname: state.pathname,
          nextPathname: action.pathname
        }
      default:
        return state
    }
  }

  const manager = {
    subscribe (callback) {
      return store.subscribe(callback)
    },
    getContent () {
      return store.getState().content
    },
    getCurrentPathname () {
      return store.getState().currentPathname
    },
    isLoading () {
      return store.getState().loading
    },
    isReady () {
      return !!store.getState().content
    },
    handleContentLoaded (pathname, content, { asynchronously }) {
      store.dispatch({ type: 'CONTENT_LOADED', pathname, content, asynchronously })
    },
    handleContentLoadStarted (pathname) {
      store.dispatch({ type: 'CONTENT_LOAD_STARTED', pathname })
    }
  }

  return manager
}

export default createRenderer
