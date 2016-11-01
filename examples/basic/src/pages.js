import React from 'react'

import Layout from './Layout'

export default {
  '/': (callback) => {
    callback(
      <Layout>
        <h1>Home page</h1>
      </Layout>
    )
  },
  '/a/': (callback) => {
    callback(
      <Layout>
        <h1>Page A</h1>
      </Layout>
    )
  },
  '/b/': (callback) => {
    callback(
      <Layout>
        <h1>Page B</h1>
      </Layout>
    )
  },
  '/pancake/': (callback) => {
    callback(
      <Layout>
        <h1>Pancake</h1>
        <p>It’s a React pancake.</p>
        <img src={require('./pancake.jpg')} />
      </Layout>
    )
  }
}
