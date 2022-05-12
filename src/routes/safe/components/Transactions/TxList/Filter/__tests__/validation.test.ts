import { isValidAmount, isValidNonce } from '../validation'

describe('validation', () => {
  describe('isValidAmount', () => {
    it('should return undefined if value is valid', () => {
      expect(isValidAmount('1')).toBeUndefined()
    })
    it('should return "Invalid number" if value is not a number', () => {
      expect(isValidAmount('a')).toBe('Invalid number')
    })
  })

  describe('isValidNonce', () => {
    it('should return undefined if value is valid', () => {
      expect(isValidNonce('1')).toBeUndefined()
    })

    it('should return undefined when no nonce is provided', () => {
      expect(isValidNonce('')).toBeUndefined()
    })

    it('should return "Invalid number" if value is not a number', () => {
      expect(isValidNonce('a')).toBe('Invalid number')
    })

    it('should return "Nonce cannot be negative" if value is negative', () => {
      expect(isValidNonce('-1')).toBe('Nonce cannot be negative')
    })
  })
})
