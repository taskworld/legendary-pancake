import './Layout.less'

import Helmet from 'react-helmet'
import React from 'react'
import { Link } from 'legendary-pancake'

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
    </div>
  )
}

const NavLink = (props) => (
  <Link {...props} activeClassName='active' />
)
