import { Link } from 'react-router'

import createRenderer from './createRenderer'
import LoadingStateContainer from './LoadingStateContainer'

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

export { Link, LoadingStateContainer, createRenderer }
