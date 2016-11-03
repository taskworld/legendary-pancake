import './Layout.less'

import Helmet from 'react-helmet'
import React from 'react'
import { Link, LoadingStateContainer } from 'legendary-pancake'

export default function Layout ({ children }) {
  return (
    <div>
      <Helmet
        titleTemplate='%s - legendary-pancake'
        link={[ asyncCSS('https://fonts.googleapis.com/css?family=Arimo:Arimo:400,400i,700,700i|Space+Mono:400,700') ]}
        script={[ loadCSS ]}
      />
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
    </div>
  )
}

function NavLink (props) {
  return <Link {...props} activeClassName='active' />
}

// Uglify and concatenate loadCSS to include as script tag.
const loadCSS = {
  innerHTML: [
    require('raw!uglify!fg-loadcss/src/loadCSS'),
    require('raw!uglify!fg-loadcss/src/cssrelpreload.js')
  ].join(';')
}
function asyncCSS (href) {
  return { rel: 'preload', href, as: 'style', onload: "this.rel='stylesheet'" }
}
