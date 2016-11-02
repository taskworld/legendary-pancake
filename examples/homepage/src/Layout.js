import './Layout.less'

import Helmet from 'react-helmet'
import React from 'react'
import { Link, LoadingStateContainer } from 'legendary-pancake'

export default function Layout ({ children }) {
  return (
    <div>
      <Helmet titleTemplate='%s - legendary-pancake' />
      <nav>
        <NavLink to='/'>Homepage</NavLink>
        <NavLink to='/docs/'>Docs</NavLink>
        <NavLink to='/pancake/'>Pancake</NavLink>
      </nav>
      <LoadingStateContainer
        renderContent={(loading) => (
          <main style={{ opacity: loading ? 0.5 : 1 }}>
            {children}
          </main>
        )}
      />
    </div>
  )
}

function NavLink (props) {
  return <Link {...props} activeClassName='active' />
}
