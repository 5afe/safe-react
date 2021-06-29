import { isValidAddress } from '../isValidAddress'

describe('isValidAddress', () => {
  it('Returns false for an empty string', () => {
    expect(isValidAddress('')).toBeFalsy()
  })
  it('Returns false when address is `undefined`', () => {
    expect(isValidAddress(undefined)).toBeFalsy()
  })
  it('Returns false for `0x123`', () => {
    expect(isValidAddress('0x123')).toBeFalsy()
  })
  it('Returns false for a valid address without `0x` prefix', () => {
    expect(isValidAddress('0000000000000000000000000000000000000001')).toBeFalsy()
  })
  it('Returns true for a valid address with `0x` prefix', () => {
    expect(isValidAddress('0x0000000000000000000000000000000000000001')).toBeTruthy()
  })
})
