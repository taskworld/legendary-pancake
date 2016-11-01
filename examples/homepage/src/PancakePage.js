import React from 'react'

export default function PancakePage () {
  return (
    <div>
      <h1>Pancake</h1>
      <p>It’s a React pancake.</p>
      <img src={require('./pancake.jpg')} />
      <p>This page is loaded asynchronously.</p>
    </div>
  )
}
