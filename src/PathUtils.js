/* global __legendary_pancake_base_pathname__ */
const basename = __legendary_pancake_base_pathname__.replace(/\/$/, '')

export function stripBasenameFromPathname (pathname) {
  if (pathname.substr(0, basename.length) === basename) {
    return pathname.substr(basename.length)
  } else {
    return pathname
  }
}

export function rebasePathname (pathname) {
  return basename + pathname
}
