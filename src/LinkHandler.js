import { isPathnameStartingWithBasename, stripBasenameFromPathname } from './PathUtils'

import PropTypes from 'prop-types'
import React from 'react'

// # LinkHandler {#LinkHandler}
//
// A `<div>` tag that handles link clicks.
//
export class LinkHandler extends React.Component {
  static contextTypes = {
    legendaryPancake: PropTypes.object
  }
  static propTypes = {
    children: PropTypes.node
  }
  render () {
    return <div onClick={this.onClick}>{this.props.children}</div>
  }
  onClick = (e) => {
    if (!e.isDefaultPrevented()) {
      for (let element = e.target; element; element = element.parentNode) {
        if (element.nodeType === 1 && element.nodeName === 'A') {
          this.handleLinkElement(e, element)
          break
        }
      }
    }
  }
  handleLinkElement (e, a) {
    if (a.protocol !== window.location.protocol) return
    if (a.host !== window.location.host) return
    if (!this.context.legendaryPancake) return
    if (!isPathnameStartingWithBasename(a.pathname)) return
    const pathname = stripBasenameFromPathname(a.pathname)
    if (!this.context.legendaryPancake.pathnameExists(pathname)) return
    this.handleLink(e, pathname)
  }
  handleLink (e, pathname) {
    if (e.metaKey) return
    if (e.shiftKey) return
    if (e.altKey) return
    if (e.ctrlKey) return
    if (e.button !== 0) return
    this.context.legendaryPancake.go(pathname)
    e.preventDefault()
  }
}

export default LinkHandler
