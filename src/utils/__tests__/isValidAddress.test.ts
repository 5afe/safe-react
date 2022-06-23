import { isValidAddress, isValidPrefixedAddress } from '../isValidAddress'

describe('isValidAddress', () => {
  it('Returns false for an empty string', () => {
    expect(isValidAddress('')).toBeFalsy()
  })
  it('Returns false for non-string values', () => {
    ;[123, true, false, null, undefined].forEach((value) => {
      expect(isValidAddress(value as unknown as string)).toBeFalsy()
    })
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

describe('isValidPrefixedAddress', () => {
  it('Returns false for an empty string', () => {
    expect(isValidPrefixedAddress('')).toBeFalsy()
  })
  it('Returns false for non-string values', () => {
    ;[123, true, false, null, undefined].forEach((value) => {
      expect(isValidPrefixedAddress(value as unknown as string)).toBeFalsy()
    })
  })
  it('Returns false when address is `undefined`', () => {
    expect(isValidPrefixedAddress(undefined)).toBeFalsy()
  })
  it('Returns false for `0x123`', () => {
    expect(isValidPrefixedAddress('0x123')).toBeFalsy()
  })
  it('Returns false for a valid address without `0x` prefix', () => {
    expect(isValidPrefixedAddress('0000000000000000000000000000000000000001')).toBeFalsy()
  })
  it('Returns false for a valid address without `0x` and valid prefix', () => {
    expect(isValidPrefixedAddress('rin:0000000000000000000000000000000000000001')).toBeFalsy()
  })
  it('Returns false for a valid address with `0x` prefix and invalid prefix', () => {
    expect(isValidPrefixedAddress('test:0x0000000000000000000000000000000000000001')).toBeFalsy()
  })
  it('Returns true for a valid address with `0x` prefix and valid shortName', () => {
    expect(isValidPrefixedAddress('rin:0x0000000000000000000000000000000000000001')).toBeTruthy()
  })
})
