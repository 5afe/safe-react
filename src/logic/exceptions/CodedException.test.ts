import { CodedException, logError } from './CodedException'
import * as constants from 'src/utils/constants'
import * as Sentry from '@sentry/react'

jest.mock('@sentry/react')
jest.mock('src/utils/constants')

describe('CodedException', () => {
  it('throws an error if code is not found', () => {
    expect(() => {
      new CodedException(534576)
    }).toThrow('0 – No such error code')
  })

  it('creates an error', () => {
    const err = new CodedException(100)
    expect(err.message).toBe('100 – Invalid input in the address field')
    expect(err.code).toBe(100)
    expect(err.uiMessage).toBe('Please enter a valid address')
  })

  it('creates an error with an extra message', () => {
    const err = new CodedException(100, '0x123')
    expect(err.message).toBe('100 – Invalid input in the address field (0x123)')
    expect(err.code).toBe(100)
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
      const err = logError(100, '123')
      expect(err.message).toBe('100 – Invalid input in the address field (123)')
      expect(console.error).toHaveBeenCalledWith(err)
    })

    it('logs to the console using the public method', () => {
      const err = new CodedException(100)
      expect(err.message).toBe('100 – Invalid input in the address field')
      expect(console.error).not.toHaveBeenCalled()
      err.log()
      expect(console.error).toHaveBeenCalledWith(err)
    })

    it('logs only the error message on prod', () => {
      ;(constants as any).IS_PRODUCTION = true
      logError(100)
      expect(console.error).toHaveBeenCalledWith('100 – Invalid input in the address field')
    })
  })

  describe('Tracking', () => {
    afterEach(() => {
      ;(constants as any).IS_PRODUCTION = false
    })

    it('tracks using Sentry on production', () => {
      ;(constants as any).IS_PRODUCTION = true
      logError(100)
      expect(Sentry.captureException).toHaveBeenCalled()
    })

    it('does not track using Sentry in non-production envs', () => {
      ;(constants as any).IS_PRODUCTION = false
      logError(100)
      expect(Sentry.captureException).not.toHaveBeenCalled()
    })
  })
})
