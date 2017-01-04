import './Layout.less'

import { Link, LinkHandler, LoadingStateContainer } from 'legendary-pancake'

import Helmet from 'react-helmet'
import React from 'react'

export default function Layout ({ children }) {
  return (
    <LinkHandler>
      <Helmet titleTemplate='%s - legendary-pancake' />
      <nav>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/introduction/'>Intro</NavLink>
        <NavLink to='/pancake/'>Pancake</NavLink>
      </nav>
      <LoadingStateContainer
        renderContent={(loading) => (
          <main style={{ opacity: loading ? 0.5 : 1 }}>
            {children}
          </main>
        )}
      />
    </LinkHandler>
  )
}

function NavLink (props) {
  return <Link {...props} activeClassName='active' />
}
