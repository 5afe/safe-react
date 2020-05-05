// @flow

export const isValid = (url: string, protocolsAllowed = ['https:', 'http:']): boolean => {
  try {
    const urlInfo = new URL(url)
    return protocolsAllowed.includes(urlInfo.protocol)
  } catch (error) {
    return false
  }
}

export const isSameHref = (url1: string, url2: string) => {
  try {
    const a = new URL(url1)
    const b = new URL(url2)
    return a.href === b.href
  } catch (error) {
    return false
  }
}
