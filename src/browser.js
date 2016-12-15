import Link from './Link'
import LinkHandler from './LinkHandler'
import LoadingStateContainer from './LoadingStateContainer'
import createRenderer from './createRenderer'

// # Browser API
//
// Require `legendary-pancake` to access this API. It provides these members:
//
// - [__createRenderer__](#createRenderer)
//
//   Creates a renderer for use in browser.
//
// - [__Link__](https://github.com/ReactTraining/react-router/blob/v3.0.0/docs/API.md#link)
//
//   The Link component from React Router.
//
// - [__LoadingStateContainer__](#LoadingStateContainer)
//
//   A component that allows you to display a loading indicator.
//

export { Link, LinkHandler, LoadingStateContainer, createRenderer }
