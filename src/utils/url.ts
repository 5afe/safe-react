export const isValid = (url, protocolsAllowed = ['https:', 'http:']) => {
  try {
    const urlInfo = new URL(url)
    return protocolsAllowed.includes(urlInfo.protocol)
  } catch (error) {
    return false
  }
}

export const isSameHref = (url1, url2) => {
  try {
    const a = new URL(url1)
    const b = new URL(url2)
    return a.href === b.href
  } catch (error) {
    return false
  }
}
