import html from 'html-loader!markdown-it-loader!../../../README.md'
import React from 'react'

import HTMLContent from './HTMLContent'

function Introduction () {
  return (
    <HTMLContent html={html} />
  )
}

export default Introduction
