import Helmet from 'react-helmet'
import React from 'react'
import { Link } from 'legendary-pancake'

import Docs from './Docs'
import Layout from './Layout'

export default {
  // Front page
  '/': (callback) => {
    callback(
      <Layout>
        <Helmet title='Home page' />
        <h1>Home page</h1>
        <p><strong>legendary-pancake</strong> is an <strong><em>advanced</em></strong> static site builder based on React.js, webpack, and React Router.</p>
        <p>Read the <Link to='/docs/'>documentation</Link>?</p>
      </Layout>
    )
  },

  // A redirect
  '/readme/': '/docs/',

  // A synchronous route
  '/docs/': (callback) => {
    callback(
      <Layout>
        <Helmet title='Docs' />
        <h1>Docs</h1>
        <Docs />
      </Layout>
    )
  },

  // An asynchronous route (using require.ensure())
  '/pancake/': (callback) => {
    require.ensure([ ], () => {
      const PancakePage = require('./PancakePage').default
      callback(
        <Layout>
          <Helmet title='Pancake' />
          <PancakePage />
        </Layout>
      )
    })
  },

  // 404 page. By convention, use /no-match/.
  '/no-match/': (callback) => {
    callback(
      <Layout>
        <Helmet title='404???' />
        <h1>404</h1>
      </Layout>
    )
  }
}
