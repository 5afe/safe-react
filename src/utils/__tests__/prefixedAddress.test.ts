import { parsePrefixedAddress, isValidPrefix } from 'src/utils/prefixedAddress'

describe('Prefixed address utils', () => {
  describe('parsePrefixedAddress', () => {
    it('parses a non-prefixed address and defaults to current shortName', () => {
      expect(parsePrefixedAddress('0xe83FA375a2a7c383B1fB6a6ed6bB22F6A123a980')).toStrictEqual({
        address: '0xe83FA375a2a7c383B1fB6a6ed6bB22F6A123a980',
        prefix: 'rin',
      })
    })

    it('parses an address with an invalid prefix', () => {
      expect(parsePrefixedAddress('fake:0xe83FA375a2a7c383B1fB6a6ed6bB22F6A123a980')).toStrictEqual({
        address: '0xe83FA375a2a7c383B1fB6a6ed6bB22F6A123a980',
        prefix: 'fake',
      })
    })

    it('parses an address with an legit prefix', () => {
      expect(parsePrefixedAddress('rin:0xe83FA375a2a7c383B1fB6a6ed6bB22F6A123a980')).toStrictEqual({
        address: '0xe83FA375a2a7c383B1fB6a6ed6bB22F6A123a980',
        prefix: 'rin',
      })
    })

    it('parses an empty address', () => {
      expect(parsePrefixedAddress('')).toStrictEqual({
        address: '',
        prefix: 'rin',
      })
    })
  })

  describe('isValidPrefix', () => {
    it('returns true for a valid short chain name', () => {
      expect(isValidPrefix('rin')).toBe(true)
    })

    it('returns false for a invalid short chain name', () => {
      expect(isValidPrefix('fake')).toBe(false)
    })
  })
})
