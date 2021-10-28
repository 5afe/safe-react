import { decodeContractError } from '../safeContractErrors'

describe('decodeContractError', () => {
  it('returns safe errors', () => {
    expect(decodeContractError('GS000: Could not finish initialization')).toBe('Could not finish initialization')
  })

  it('returns safe errors irregardless of place in error', () => {
    expect(decodeContractError('testGS000test')).toBe('Could not finish initialization')
    expect(decodeContractError('test GS000 test')).toBe('Could not finish initialization')
  })
  it('returns safe errors irregardless of case', () => {
    expect(decodeContractError('gs000: testing')).toBe('Could not finish initialization')
  })

  it('returns provided errors if not safe errors', () => {
    expect(decodeContractError('Not a Safe error')).toBe('Not a Safe error')
  })
})
