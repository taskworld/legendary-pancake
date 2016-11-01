import './Layout.less'

import React from 'react'
import { Link } from 'legendary-pancake'

export default function Layout ({ children }) {
  return (
    <div>
      <nav>
        <NavLink to='/'>Homepage</NavLink>
        <NavLink to='/a/'>Page A</NavLink>
        <NavLink to='/b/'>Page B</NavLink>
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
