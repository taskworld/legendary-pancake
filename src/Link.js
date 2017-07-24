import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'
import { rebasePathname } from './PathUtils'

// # Link {#Link}
//
// A link to another pathname.
//
export class Link extends React.Component {
  static contextTypes = {
    legendaryPancake: PropTypes.object
  }
  static propTypes = {
    to: PropTypes.string,
    activeClassName: PropTypes.string,
    isActive: PropTypes.func,
    children: PropTypes.node
  }
  static defaultProps = {
    isActive: (pathName, to) => pathName === to
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
    const { to, children, isActive, className, activeClassName, ...others } = this.props
    const active = isActive(this.state.currentPathname, to)
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
    if (!e.isDefaultPrevented()) this.handleLink(e)
  }
  handleLink (e) {
    if (e.metaKey) return
    if (e.shiftKey) return
    if (e.altKey) return
    if (e.ctrlKey) return
    if (e.button !== 0) return
    this.context.legendaryPancake.go(this.props.to)
    e.preventDefault()
  }
}

export default Link
