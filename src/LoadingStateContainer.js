import React from 'react'

export class LoadingStateContainer extends React.Component {
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
  componentWillUnmount () {
    this.unsubscribe()
  }
  render () {
    return this.props.renderContent(this.state.loading)
  }
}
LoadingStateContainer.propTypes = {
  renderContent: React.PropTypes.func.isRequired
}
LoadingStateContainer.contextTypes = {
  legendaryPancakeManager: React.PropTypes.object
}

export default LoadingStateContainer
