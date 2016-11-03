// Finds the page by given pathname.
export function resolvePage (pages, pathname) {
  return pages[pathname] || pages['/404.html'] || pages['/no-match/']
}

export default resolvePage
