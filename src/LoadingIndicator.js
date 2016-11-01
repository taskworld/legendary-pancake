import React from 'react'

export class LoadingIndicator extends React.Component {
  constructor (props, context) {
    super(props, context)
    const manager = context.legendaryPancakeManager
    this.manager = manager
    this.state = { loading: manager ? manager.isLoading() : false }
  }
  componentDidMount () {
    const manager = this.manager
    this.unsubscribe = manager.subscribe(() => {
      this.setState({ loading: manager.isLoading() })
    })
  }
  shouldComponentUpdate (nextProps, nextState) {
    return this.state.loading !== nextState.loading
  }
  componentWillUnmount () {
    this.unsubscribe()
  }
  render () {
    return this.props.renderIndicator(this.state.loading)
  }
}
LoadingIndicator.propTypes = {
  renderIndicator: React.PropTypes.func.isRequired
}
LoadingIndicator.contextTypes = {
  legendaryPancakeManager: React.PropTypes.object
}

export default LoadingIndicator
