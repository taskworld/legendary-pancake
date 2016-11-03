
const documentationMetadataContext = require.context(
  'json!front-matter?onlyAttributes!../../../docs',
  false,
  /\.md$/
)

const documentationContentBundleContext = require.context(
  'bundle-loader?lazy!html-loader!markdown-it-loader!front-matter?onlyBody!../../../docs',
  false,
  /\.md$/
)

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
