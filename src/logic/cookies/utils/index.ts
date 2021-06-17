import Cookies from 'js-cookie'

import { getNetworkName } from 'src/config'
import { Errors, logError } from 'src/logic/exceptions/CodedException'

const PREFIX = `v1_${getNetworkName()}`

export const loadFromCookie = async (key: string, withoutPrefix = false): Promise<undefined | Record<string, any>> => {
  const prefix = withoutPrefix ? '' : `${PREFIX}__`
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

export const saveCookie = async (key: string, value: Record<string, any>, expirationDays: number): Promise<void> => {
  try {
    const stringifiedValue = JSON.stringify(value)
    const expiration = expirationDays ? { expires: expirationDays } : undefined
    await Cookies.set(`${PREFIX}__${key}`, stringifiedValue, expiration)
  } catch (err) {
    logError(Errors._701, `cookie ${key} – ${err.message}`)
  }
}

export const removeCookie = (key: string, path: string, domain: string): void => Cookies.remove(key, { path, domain })
