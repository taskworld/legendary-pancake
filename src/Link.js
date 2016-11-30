import classNames from 'classnames'
import React from 'react'

import { rebasePathname } from './PathUtils'

// # Link {#Link}
//
// A React component that renders a link.
//
export class Link extends React.Component {
  static contextTypes = {
    legendaryPancake: React.PropTypes.object
  }
  static propTypes = {
    to: React.PropTypes.string,
    activeClassName: React.PropTypes.string,
    children: React.PropTypes.node
  }
  constructor (props, context) {
    super(props, context)
    const manager = context.legendaryPancake.manager
    this.manager = manager
    this.state = { currentPathname: manager.getCurrentPathname() }
  }
  componentDidMount () {
    const manager = this.manager
    this.unsubscribe = manager.subscribe(() => {
      this.setState({ currentPathname: manager.getCurrentPathname() })
    })
  }
  componentWillUnmount () {
    this.unsubscribe()
  }
  render () {
    const { to, children, className, activeClassName, ...others } = this.props
    const active = this.state.currentPathname === to
    const classNameToRender = classNames(className, active && activeClassName)
    return (
      <a
        href={rebasePathname(to)}
        className={classNameToRender}
        {...others}
        onClick={this.onClick}
      >{children}</a>
    )
  }
  onClick = (e) => {
    if (this.props.onClick) this.props.onClick(e)
    if (!e.defaultPrevented) this.handleLink(e)
  }
  handleLink (event) {
    const e = event.nativeEvent
    if (e.metaKey) return
    if (e.shiftKey) return
    if (e.altKey) return
    if (e.ctrlKey) return
    console.log(e.which)
    if (e.which !== 1) return
    this.context.legendaryPancake.go(this.props.to)
    event.preventDefault()
  }
}

export default Link
