import { getSafeError, isSafeError } from '../safeErrors'

describe('isSafeError', () => {
  it('returns true if a safe error exists in any error name', () => {
    expect(isSafeError({ name: 'GS000', message: 'test' })).toBe(true)
  })
  it('returns true if a safe error exists in any error message', () => {
    expect(isSafeError({ name: 'test', message: 'Could not finish initialization' })).toBe(true)
  })
  it('returns false if not safe error', () => {
    expect(isSafeError({ name: 'test', message: 'test' })).toBe(false)
  })
})

describe('getSafeError', () => {
  it('returns safe errors', () => {
    const error = { name: 'GS000', message: 'Will not be returned' }
    expect(getSafeError(error)).toBe('Could not finish initialization')
  })

  it('returns provided errors if not safe errors', () => {
    const error = { name: 'Not a Safe error', message: 'Will be returned' }
    expect(getSafeError(error)).toBe('Will be returned')
  })
})
