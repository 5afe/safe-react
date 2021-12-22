import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { LS_NAMESPACE, LS_SEPARATOR } from '../constants'

type BrowserStorage = typeof localStorage | typeof sessionStorage

const DEFAULT_PREFIX = `${LS_NAMESPACE}${LS_SEPARATOR}`

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

    if (!saved || saved === 'undefined') return

    try {
      return JSON.parse(saved) as T
    } catch (err) {
      logError(Errors._700, `key ${key} – ${err.message}`)
    }
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
