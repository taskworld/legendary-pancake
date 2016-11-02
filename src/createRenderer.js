import useScroll from 'react-router-scroll/lib/useScroll'
import React from 'react'
import { createHistory } from 'history'
import { render } from 'react-dom'
import { applyRouterMiddleware, Router, Route, useRouterHistory } from 'react-router'
import { createStore } from 'redux'

import resolvePage from './resolvePage'

// Creates a renderer object that can render the static page into the DOM.
export function createRenderer (pages, {
  renderPage = (page) => page
} = { }) {
  const manager = createManager()
  let currentPathname

  // This component subscribes to the manager and renders its content.
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
      return { legendaryPancakeManager: manager }
    }
    componentWillUnmount () {
      this.unsubscribe()
    }
    render () {
      return renderPage(this.state.content)
    }
  }
  PageRenderer.propTypes = {
    location: React.PropTypes.object.isRequired // from react-router
  }
  PageRenderer.childContextTypes = {
    legendaryPancakeManager: React.PropTypes.object
  }

  // Loads the page and give the content to the manager, and fire callback.
  function handlePathname (pathname, callback) {
    currentPathname = pathname
    const nextPage = resolvePage(pages, pathname)
    let loaded = false
    let asynchronously = false
    nextPage((nextContent) => {
      manager.handleContentLoaded(pathname, nextContent, { asynchronously })
      loaded = true
      callback()
    })
    if (!loaded) {
      manager.handleContentLoadStarted(pathname)
      asynchronously = true
    }
  }

  function replacePages (nextPages) {
    pages = nextPages
    if (currentPathname) {
      handlePathname(currentPathname, () => {
        console.log('[legendary-pancake] Hot reloaded!')
      })
    }
  }

  function createHotReloadHandler (getPages) {
    return () => replacePages(getPages())
  }

  return {
    // Loads the first page, then renders the router into the DOM.
    renderTo (container) {
      /* global __webpack_public_path__ */
      const basename = __webpack_public_path__.replace(/\/$/, '')
      const browserHistory = useRouterHistory(createHistory)({ basename })

      const initialLocation = browserHistory.getCurrentLocation()
      const initialPathname = initialLocation.pathname
      const initialPage = resolvePage(pages, initialPathname)

      if (typeof initialPage === 'string') {
        window.location.replace(basename + initialPage)
        return
      }

      initialPage((initialContent) => {
        manager.handleContentLoaded(initialPathname, initialContent, { asynchronously: false })
        function onEnter (nextState, replace, callback) {
          const nextPathname = nextState.location.pathname
          const nextPage = resolvePage(pages, nextPathname)
          if (typeof nextPage === 'string') {
            replace(nextPage)
          } else {
            handlePathname(nextPathname, callback)
          }
        }
        const element = (
          <Router history={browserHistory} render={applyRouterMiddleware(useScroll())}>
            <Route path='*' component={PageRenderer} onEnter={onEnter} />
          </Router>
        )
        render(element, container)
      })
    },

    createHotReloadHandler
  }
}

// Creates a content manager which stores the content to render.
function createManager () {
  const store = createStore(reducer)
  return {
    subscribe (callback) {
      return store.subscribe(callback)
    },
    getContent () {
      return store.getState().content
    },
    isLoading () {
      return store.getState().loading
    },
    handleContentLoaded (pathname, content, { asynchronously }) {
      store.dispatch({ type: 'CONTENT_LOADED', pathname, content, asynchronously })
    },
    handleContentLoadStarted (pathname) {
      store.dispatch({ type: 'CONTENT_LOAD_STARTED', pathname })
    }
  }

  function reducer (state = { content: null, loading: true, pathname: null }, action) {
    switch (action.type) {
      case 'CONTENT_LOADED':
        if (!action.asynchronously || action.pathname === state.pathname) {
          return { content: action.content, loading: false, pathname: action.pathname }
        } else {
          return state
        }
      case 'CONTENT_LOAD_STARTED':
        return { content: state.content, loading: true, pathname: action.pathname }
      default:
        return state
    }
  }
}

export default createRenderer
