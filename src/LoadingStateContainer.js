import React from 'react'

// # LoadingStateContainer {#LoadingStateContainer}
//
// A React component that lets you render a loading indicator.
//
export class LoadingStateContainer extends React.Component {
  constructor (props, context) {
    super(props, context)
    const manager = context.legendaryPancake && context.legendaryPancake.manager
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
  // It takes the following props:
  //
  // - `renderContent(loading)` This prop will be called with a boolean value
  //   `loading` and should return the thing that this component should render.
  //
  renderContent: React.PropTypes.func.isRequired
}
LoadingStateContainer.contextTypes = {
  legendaryPancake: React.PropTypes.object
}

export default LoadingStateContainer
