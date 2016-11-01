import Helmet from 'react-helmet'
import React from 'react'
import { Link } from 'legendary-pancake'

import Layout from './Layout'

export default {
  '/': (callback) => {
    callback(
      <Layout>
        <Helmet title='Home page' />
        <h1>Home page</h1>
        <p><strong>legendary-pancake</strong> is a very customizable static site builder based on React.js, webpack, and React Router.</p>
        <p>Read the <Link to='/docs/'>documentation</Link>?</p>
      </Layout>
    )
  },
  '/docs/': (callback) => {
    require.ensure([ ], () => {
      const Docs = require('./Docs').default
      callback(
        <Layout>
          <Helmet title='Docs' />
          <h1>Docs</h1>
          <Docs />
        </Layout>
      )
    })
  },
  '/pancake/': (callback) => {
    callback(
      <Layout>
        <Helmet title='Pancake' />
        <h1>Pancake</h1>
        <p>It’s a React pancake.</p>
        <img src={require('./pancake.jpg')} />
      </Layout>
    )
  },
  '/no-match/': (callback) => {
    callback(
      <Layout>
        <Helmet title='404???' />
        <h1>404</h1>
      </Layout>
    )
  }
}
