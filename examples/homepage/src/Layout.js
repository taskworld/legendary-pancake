import './Layout.less'

import Helmet from 'react-helmet'
import React from 'react'
import { Link, LoadingStateContainer } from 'legendary-pancake'

const loadCSS = [
  require('raw!uglify!fg-loadcss/src/loadCSS'),
  require('raw!uglify!fg-loadcss/src/cssrelpreload.js')
].join(';')

export default function Layout ({ children }) {
  return (
    <div>
      <Helmet
        titleTemplate='%s - legendary-pancake'
        link={[
          { rel: 'preload', href: 'https://fonts.googleapis.com/css?family=Arimo:Arimo:400,400i,700,700i|Space+Mono:400,700', as: 'style', onload: "this.rel='stylesheet'" }
        ]}
        script={[
          { innerHTML: loadCSS }
        ]}
      />
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
