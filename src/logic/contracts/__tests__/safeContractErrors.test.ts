import { decodeMessage } from '../safeContractErrors'

describe('decodeMessage', () => {
  it('returns safe errors', () => {
    expect(decodeMessage('GS000: Could not finish initialization')).toBe('GS000: Could not finish initialization')
  })

  it('returns safe errors irregardless of place in error', () => {
    expect(decodeMessage('testGS000test')).toBe('GS000: Could not finish initialization')
    expect(decodeMessage('test GS000 test')).toBe('GS000: Could not finish initialization')
  })
  it('returns safe errors irregardless of case', () => {
    expect(decodeMessage('gs000: testing')).toBe('GS000: Could not finish initialization')
  })

  it('returns provided errors if not safe errors', () => {
    expect(decodeMessage('Not a Safe error')).toBe(null)
  })
})
