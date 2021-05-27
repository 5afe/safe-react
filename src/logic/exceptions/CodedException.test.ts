import { Errors, logError, CodedException } from './CodedException'
import * as constants from 'src/utils/constants'
import * as Sentry from '@sentry/react'

jest.mock('@sentry/react')
jest.mock('src/utils/constants')

describe('CodedException', () => {
  it('throws an error if code is not found', () => {
    expect(Errors.___0).toBe('0: No such error code')

    expect(() => {
      new CodedException('weird error' as any)
    }).toThrow('0: No such error code (weird error)')
  })

  it('creates an error', () => {
    const err = new CodedException(Errors._100)
    expect(err.message).toBe('100: Invalid input in the address field')
    expect(err.code).toBe(100)
  })

  it('creates an error with an extra message', () => {
    const err = new CodedException(Errors._100, '0x123')
    expect(err.message).toBe('100: Invalid input in the address field (0x123)')
    expect(err.code).toBe(100)
  })

  it('creates an error with an extra message and a context', () => {
    const context = {
      tags: {
        error_category: 'Safe Apps',
      },
      contexts: {
        safeApp: {
          name: 'Zorbed.Finance',
          url: 'https://zorbed.finance',
        },
        message: {
          method: 'getSafeBalance',
          params: {
            address: '0x000000',
          },
        },
      },
    }

    const err = new CodedException(Errors._901, 'getSafeBalance: Server responded with 429 Too Many Requests', context)
    expect(err.message).toBe(
      '901: Error processing Safe Apps SDK request (getSafeBalance: Server responded with 429 Too Many Requests)',
    )
    expect(err.code).toBe(901)
    expect(err.context).toEqual(context)
  })

  describe('Logging', () => {
    beforeAll(() => {
      jest.mock('console')
      console.error = jest.fn()
    })
    afterEach(() => {
      jest.unmock('console')
      ;(constants as any).IS_PRODUCTION = false
    })

    it('logs to the console', () => {
      const err = logError(Errors._100, '123')
      expect(err.message).toBe('100: Invalid input in the address field (123)')
      expect(console.error).toHaveBeenCalledWith(err)
    })

    it('logs to the console via the public log method', () => {
      const err = new CodedException(Errors._601)
      expect(err.message).toBe('601: Error fetching balances')
      expect(console.error).not.toHaveBeenCalled()
      err.log()
      expect(console.error).toHaveBeenCalledWith(err)
    })

    it('logs only the error message on prod', () => {
      ;(constants as any).IS_PRODUCTION = true
      logError(Errors._100)
      expect(console.error).toHaveBeenCalledWith('100: Invalid input in the address field')
    })
  })

  describe('Tracking', () => {
    afterEach(() => {
      ;(constants as any).IS_PRODUCTION = false
    })

    it('tracks using Sentry on production', () => {
      ;(constants as any).IS_PRODUCTION = true
      logError(Errors._100)
      expect(Sentry.captureException).toHaveBeenCalled()
    })

    it("doesn't track when isTracked is false", () => {
      ;(constants as any).IS_PRODUCTION = true
      logError(Errors._100, '', undefined, false)
      expect(Sentry.captureException).not.toHaveBeenCalled()
    })

    it('does not track using Sentry in non-production envs', () => {
      ;(constants as any).IS_PRODUCTION = false
      logError(Errors._100)
      expect(Sentry.captureException).not.toHaveBeenCalled()
    })
  })
})
