import Cookies, { CookieAttributes } from 'js-cookie'
import { Errors, logError } from 'src/logic/exceptions/CodedException'

export type Cookie = {
  name: string
  path: string
}

const PREFIX = 'v1_MAINNET__'

export const loadFromCookie = <T extends Record<string, any>>(key: string, withoutPrefix = false): T | undefined => {
  const prefix = withoutPrefix ? '' : PREFIX
  try {
    const stringifiedValue = Cookies.get(`${prefix}${key}`)
    if (stringifiedValue === null || stringifiedValue === undefined) {
      return undefined
    }

    return JSON.parse(stringifiedValue)
  } catch (err) {
    logError(Errors._700, `cookie ${key} – ${err.message}`)
    return undefined
  }
}

export const saveCookie = <T extends Record<string, any>>(
  key: string,
  value: T,
  options: CookieAttributes,
  withoutPrefix = false,
): void => {
  const prefix = withoutPrefix ? '' : PREFIX
  try {
    const stringifiedValue = JSON.stringify(value)
    Cookies.set(`${prefix}${key}`, stringifiedValue, options)
  } catch (err) {
    logError(Errors._701, `cookie ${key} – ${err.message}`)
  }
}

export const removeCookie = (key: string, path: string, domain: string): void => Cookies.remove(key, { path, domain })

export const removeCookies = (cookieList: Cookie[]): void => {
  // Extracts domain, e.g. gnosis-safe.io
  const domain = location.host.split('.').slice(-2).join('.')
  cookieList.forEach((cookie) => removeCookie(cookie.name, cookie.path, `.${domain}`))
}
