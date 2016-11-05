module.exports = `
  ${asyncCSS('https://fonts.googleapis.com/css?family=Arimo:Arimo:400,400i,700,700i|Space+Mono:400,700')}
  ${loadCSS()}
`

// Generates a <link> tag that loads the CSS file asynchronously.
function asyncCSS (href) {
  return `<LINK REL="preload" HREF="${href}" AS=style ONLOAD="this.rel='stylesheet'" />`
}

// Uglify and concatenate loadCSS to include as script tag.
function loadCSS () {
  const script = [
    require('raw!uglify!fg-loadcss/src/loadCSS'),
    require('raw!uglify!fg-loadcss/src/cssrelpreload.js')
  ].join(';')
  return '<SCRIPT>' + script + '</SCRIPT>'
}
