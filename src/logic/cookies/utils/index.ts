import Cookies, { CookieAttributes } from 'js-cookie'
import { Errors, logError } from 'src/logic/exceptions/CodedException'

const PREFIX = 'v1_MAINNET__'

export const loadFromCookie = async (key: string, withoutPrefix = false): Promise<undefined | Record<string, any>> => {
  const prefix = withoutPrefix ? '' : PREFIX
  try {
    const stringifiedValue = await Cookies.get(`${prefix}${key}`)
    if (stringifiedValue === null || stringifiedValue === undefined) {
      return undefined
    }

    return JSON.parse(stringifiedValue)
  } catch (err) {
    logError(Errors._700, `cookie ${key} – ${err.message}`)
    return undefined
  }
}

export const saveCookie = async (
  key: string,
  value: Record<string, any>,
  options: CookieAttributes,
  withoutPrefix = false,
): Promise<void> => {
  const prefix = withoutPrefix ? '' : PREFIX
  try {
    const stringifiedValue = JSON.stringify(value)
    await Cookies.set(`${prefix}${key}`, stringifiedValue, options)
  } catch (err) {
    logError(Errors._701, `cookie ${key} – ${err.message}`)
  }
}

export const removeCookie = (key: string, path: string, domain: string): void => Cookies.remove(key, { path, domain })
