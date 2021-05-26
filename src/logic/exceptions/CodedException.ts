import * as Sentry from '@sentry/react'
import { CaptureContext } from '@sentry/types'
import ErrorCodes from './registry'
import { IS_PRODUCTION } from 'src/utils/constants'

export class CodedException extends Error {
  public readonly code: number
  public readonly context?: CaptureContext

  constructor(content: ErrorCodes, extraMessage?: string, context?: CaptureContext) {
    super()

    const codePrefix = content.split(':')[0]
    const code = Number(codePrefix)
    if (isNaN(code)) {
      throw new CodedException(ErrorCodes.___0, extraMessage, context)
    }

    const extraInfo = extraMessage ? ` (${extraMessage})` : ''
    this.message = `${content}${extraInfo}`
    this.code = code
    this.context = context
  }

  /**
   * Log the error in the console and send to Sentry
   */
  public log(isTracked = true): void {
    // Log only the message on prod, and the full error on dev
    console.error(IS_PRODUCTION ? this.message : this)

    if (IS_PRODUCTION && isTracked) {
      Sentry.captureException(this, this.context)
    }
  }
}

export function logError(
  content: ErrorCodes,
  extraMessage?: string,
  context?: CaptureContext,
  isTracked?: boolean,
): CodedException {
  const error = new CodedException(content, extraMessage, context)
  error.log(isTracked)
  return error
}

export const Errors = ErrorCodes
