import * as Sentry from '@sentry/react'
import registry from './registry'
import { IS_PRODUCTION } from 'src/utils/constants'

export class CodedException extends Error {
  public readonly message: string
  public readonly code: number
  public readonly uiMessage: string | undefined

  constructor(code: keyof typeof registry, extraMessage?: string) {
    super()

    const content = registry[code]
    if (!content) {
      throw new CodedException(0, `${code}`)
    }

    const extraInfo = extraMessage ? ` (${extraMessage})` : ''
    this.message = `${code} – ${content.description}${extraInfo}`
    this.code = code
    this.uiMessage = content.uiMessage
  }

  /**
   * Log the error in the console and send to Sentry
   */
  public log(isTracked = true): void {
    // Log only the message on prod, and the full error on dev
    console.error(IS_PRODUCTION ? this.message : this)

    if (IS_PRODUCTION && isTracked) {
      Sentry.captureException(this)
    }
  }
}

export function logError(code: keyof typeof registry, extraMessage?: string, isTracked?: boolean): CodedException {
  const error = new CodedException(code, extraMessage)
  error.log(isTracked)
  return error
}
