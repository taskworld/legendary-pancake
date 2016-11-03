import './HTMLContent.less'

import React from 'react'

function HTMLContent ({ html }) {
  return (
    <div className='HTMLContent' dangerouslySetInnerHTML={{ __html: html }} />
  )
}

export default HTMLContent
