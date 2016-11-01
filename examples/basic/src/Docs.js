import './Docs.less'

import text from 'html-loader!markdown-it-loader!../../../README.md'
import React from 'react'

function Docs () {
  return (
    <div className='Docs' dangerouslySetInnerHTML={{ __html: text }} />
  )
}

export default Docs
