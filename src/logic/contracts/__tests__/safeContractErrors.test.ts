import { _decodeErrorMessage } from '../safeContractErrors'

describe('_decodeErrorMessage', () => {
  it('returns safe errors', () => {
    expect(_decodeErrorMessage('GS000: Could not finish initialization')).toBe('GS000: Could not finish initialization')
  })

  it('returns safe errors irregardless of place in error', () => {
    expect(_decodeErrorMessage('testGS000test')).toBe('GS000: Could not finish initialization')
    expect(_decodeErrorMessage('test GS000 test')).toBe('GS000: Could not finish initialization')
  })
  it('returns safe errors irregardless of case', () => {
    expect(_decodeErrorMessage('gs000: testing')).toBe('GS000: Could not finish initialization')
  })

  it('returns provided errors if not safe errors', () => {
    expect(_decodeErrorMessage('Not a Safe error')).toBe('Not a Safe error')
  })
})
