import * as Sentry from '@sentry/react'
import registry, { ExceptionContent } from './registry'
import { IS_PRODUCTION } from 'src/utils/constants'

class CodedException extends Error {
  public code: number
  public content: ExceptionContent

  static throwError(code: number) {
    const error = new CodedException(code)
    error.log()
    throw error
  }

  constructor(code: number, isTracked?: boolean, isLogged?: boolean) {
    super()
    const content = registry[code]
    this.code = code
    this.content = {
      ...content,
      isTracked: isTracked == null ? content.isTracked : isTracked,
      isLogged: isLogged == null ? content.isLogged : isLogged,
    }
    this.message = `${code}: ${content.description}`
  }

  log(): void {
    if (!IS_PRODUCTION || this.content.isLogged) {
      console.error(IS_PRODUCTION ? this.message : this)
    }

    if (this.content.isTracked) {
      Sentry.captureException(this)
    }
  }
}

export default CodedException
