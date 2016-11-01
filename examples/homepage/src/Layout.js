import './Layout.less'

import Helmet from 'react-helmet'
import React from 'react'
import { Link, LoadingIndicator } from 'legendary-pancake'

export default function Layout ({ children }) {
  return (
    <div>
      <Helmet titleTemplate='%s - legendary-pancake' />
      <nav>
        <NavLink to='/'>Homepage</NavLink>
        <NavLink to='/docs/'>Docs</NavLink>
        <NavLink to='/pancake/'>Pancake</NavLink>
      </nav>
      <main>
        {children}
      </main>
      <LoadingIndicator renderIndicator={renderLoadingIndicator} />
    </div>
  )
}

function NavLink (props) {
  return <Link {...props} activeClassName='active' />
}

function renderLoadingIndicator (loading) {
  if (loading) {
    return <PageLoading />
  } else {
    return null
  }
}

function PageLoading () {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        background: '#444',
        color: '#fff',
        padding: '0.4em',
        fontSize: '0.67em'
      }}
    >
      Loading asynchronous route...
    </div>
  )
}
