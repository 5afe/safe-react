import { logError, Errors } from 'src/logic/exceptions/CodedException'

type BrowserStorage = typeof localStorage | typeof sessionStorage

const DEFAULT_PREFIX = 'SAFE__'

class Storage {
  private prefix: string
  private storage: BrowserStorage

  constructor(storage: BrowserStorage, prefix = DEFAULT_PREFIX) {
    this.prefix = prefix
    this.storage = storage
  }

  private prefixKey = (key: string): string => {
    return `${this.prefix}${key}`
  }

  public getItem = <T>(key: string): T | undefined => {
    const fullKey = this.prefixKey(key)
    let saved: string | null = null
    try {
      saved = this.storage.getItem(fullKey)
    } catch (err) {
      logError(Errors._700, `key ${key} – ${err.message}`)
    }

    let data = undefined
    if (saved) {
      try {
        data = JSON.parse(saved)
      } catch (err) {
        logError(Errors._700, `key ${key} – ${err.message}`)
        data = undefined
      }
    }

    return data as unknown as T | undefined
  }

  public setItem = <T>(key: string, item: T): void => {
    const fullKey = this.prefixKey(key)
    try {
      this.storage.setItem(fullKey, JSON.stringify(item))
    } catch (err) {
      logError(Errors._701, `key ${key} – ${err.message}`)
    }
  }

  public removeItem = (key: string): void => {
    const fullKey = this.prefixKey(key)
    try {
      this.storage.removeItem(fullKey)
    } catch (err) {
      logError(Errors._702, `key ${key} – ${err.message}`)
    }
  }
}

export default Storage
