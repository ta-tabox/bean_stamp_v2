export function readCurrentPath(requestHeaders: Headers) {
  const nextUrl = requestHeaders.get("next-url")

  if (nextUrl) {
    return nextUrl
  }

  const matchedPath = requestHeaders.get("x-matched-path")

  if (matchedPath) {
    return matchedPath
  }

  return ""
}
