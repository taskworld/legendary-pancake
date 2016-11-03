
// Create a webpack context for documentation metadata based on files in the
// `docs` folder. This gives us access to all document metadata.
//
// See: https://webpack.github.io/docs/context.html
//
const documentationMetadataContext = require.context(
  'json!front-matter?onlyAttributes!../../../docs',
  false,
  /\.md$/
)

// Create a webpack context for documentation content based on files in the
// docs folder. The documentation content is loaded asynchronously.
//
// - `front-matter?onlyBody` parses the file and returns the content after
//   the front-matter, which is a Markdown text.
// - `markdown-it-loader` parses the Markdown text and returns HTML.
// - `html-loader` parses the HTML and turns images into `require()` calls,
//   and returns JavaScript module.
// - `bundle-loader?lazy` moves that module (and its dependencies) to a
//   separate chunk, and returns a function to load that chunk asynchronously.
//
const documentationContentBundleContext = require.context(
  'bundle-loader?lazy!html-loader!markdown-it-loader!front-matter?onlyBody!../../../docs',
  false,
  /\.md$/
)

// Public: Generate an array representing documentation pages.
//
// - `url` The URL that this document should go to.
// - `metadata` The metadata specified in the front matter.
// - `loadContent` A function to asynchronously load the document’s contents.
//   The callback will be called when loaded with the html source code.
//
export const documentationPages = documentationMetadataContext.keys().map((key) => {
  const metadata = documentationMetadataContext(key)
  const url = key.replace(/^\.\//, '/docs/').replace(/\.md$/, '/')
  return {
    url,
    metadata,
    loadContent: documentationContentBundleContext(key)
  }
})

export default documentationPages
