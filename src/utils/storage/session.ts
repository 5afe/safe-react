import { logError, Errors } from 'src/logic/exceptions/CodedException'

export const loadFromSessionStorage = <T = unknown>(key: string): T | undefined => {
  try {
    const stringifiedValue = sessionStorage.getItem(key)

    if (stringifiedValue === null || stringifiedValue === undefined) {
      return undefined
    }

    return JSON.parse(stringifiedValue)
  } catch (err) {
    logError(Errors._704, `key ${key} – ${err.message}`)
  }
}

export const saveToSessionStorage = <T = unknown>(key: string, value: T): void => {
  try {
    const stringifiedValue = JSON.stringify(value)

    sessionStorage.setItem(key, stringifiedValue)
  } catch (err) {
    logError(Errors._705, `key ${key} – ${err.message}`)
  }
}

export const removeFromSessionStorage = (key: string): void => {
  try {
    sessionStorage.removeItem(key)
  } catch (err) {
    logError(Errors._706, `key ${key} – ${err.message}`)
  }
}
