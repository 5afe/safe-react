import * as Sentry from '@sentry/react'
import ErrorCodes from './registry'
import { IS_PRODUCTION } from 'src/utils/constants'

/**
 * Convert the ErrorCodes to a map of messages to codes for reverse lookup
 */
const errorCodeMap: Record<string, number> = Object.keys(ErrorCodes).reduce((result, key) => {
  const code = Number(key.slice(1))
  const description = ErrorCodes[key]
  result[description] = code
  return result
}, {})

export class CodedException extends Error {
  public readonly message: string
  public readonly code: number

  constructor(content: ErrorCodes, extraMessage?: string) {
    super()

    const code = errorCodeMap[content]
    if (code == null) {
      throw new CodedException(ErrorCodes._0)
    }

    const extraInfo = extraMessage ? ` (${extraMessage})` : ''
    this.message = `${code} – ${content}${extraInfo}`
    this.code = code
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

export function logError(content: ErrorCodes, extraMessage?: string, isTracked?: boolean): CodedException {
  const error = new CodedException(content, extraMessage)
  error.log(isTracked)
  return error
}

export const Errors = ErrorCodes
