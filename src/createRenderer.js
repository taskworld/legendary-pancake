import useScroll from 'react-router-scroll/lib/useScroll'
import React from 'react'
import { render } from 'react-dom'
import { applyRouterMiddleware, Router, browserHistory, Route } from 'react-router'

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
      this.unsubscribe = manager.onContentChange(() => {
        const content = manager.getContent()
        this.setState({ content })
      })
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

  // Loads the page and give the content to the manager, and fire callback.
  function handlePathname (pathname, callback) {
    currentPathname = pathname
    const nextPage = resolvePage(pages, pathname)
    nextPage((nextContent) => {
      manager.setContent(nextContent)
      callback()
    })
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
      const initialPathname = window.location.pathname
      const initialPage = resolvePage(pages, initialPathname)
      initialPage((initialContent) => {
        manager.setContent(initialContent)
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
  let handleContentChange = null
  let currentContent = null
  return {
    onContentChange (callback) {
      if (handleContentChange) {
        throw new Error('renderTo() must be called only once!')
      }
      handleContentChange = callback
      return function unsubscribe () {
        if (handleContentChange !== callback) {
          throw new Error('Already unsubscribed')
        }
        handleContentChange = null
      }
    },
    getContent () {
      return currentContent
    },
    setContent (content) {
      currentContent = content
      if (handleContentChange) {
        handleContentChange()
      }
    }
  }
}

export default createRenderer
