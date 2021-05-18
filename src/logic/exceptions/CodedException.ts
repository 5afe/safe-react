import * as Sentry from '@sentry/react'
import ErrorCodes from './registry'
import { IS_PRODUCTION } from 'src/utils/constants'

function getRegisryCode(content: ErrorCodes): number {
  const key = Object.keys(ErrorCodes).find((key) => ErrorCodes[key] === content)
  if (!key) {
    throw new CodedException(ErrorCodes._0)
  }
  const code = Number(key.slice(1))
  return code
}

export class CodedException extends Error {
  public readonly message: string
  public readonly code: number

  constructor(content: ErrorCodes, extraMessage?: string) {
    super()

    const code = getRegisryCode(content)
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
