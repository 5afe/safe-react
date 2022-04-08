import * as appearanceSelectors from 'src/logic/appearance/selectors'
import * as utils from '../utils'

const VALID_ADDRESS = '0x1234567890123456789012345678901234567890'
const PREFIXED_VALID_ADDRESS = `rin:${VALID_ADDRESS}`

describe('utils', () => {
  describe('getFormattedAddress', () => {
    it('should return the address without the prefix based on user preference', () => {
      jest.spyOn(appearanceSelectors, 'showShortNameSelector').mockReturnValue(false)

      expect(utils.getFormattedAddress(PREFIXED_VALID_ADDRESS)).toEqual(VALID_ADDRESS)
      expect(utils.getFormattedAddress(VALID_ADDRESS)).toEqual(VALID_ADDRESS)
    })
    it('should return the address with the prefix based on user preference', () => {
      jest.spyOn(appearanceSelectors, 'showShortNameSelector').mockReturnValue(true)

      expect(utils.getFormattedAddress(VALID_ADDRESS)).toEqual(PREFIXED_VALID_ADDRESS)
      expect(utils.getFormattedAddress(PREFIXED_VALID_ADDRESS)).toEqual(PREFIXED_VALID_ADDRESS)
    })
    it('should shorten the address', () => {
      jest
        .spyOn(appearanceSelectors, 'showShortNameSelector')
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)

      expect(utils.getFormattedAddress(VALID_ADDRESS, true)).toBe('0x123456...567890')
      expect(utils.getFormattedAddress(PREFIXED_VALID_ADDRESS, true)).toBe('0x123456...567890')

      // Doesn't include shortNames in shortening
      expect(utils.getFormattedAddress(VALID_ADDRESS, true)).toBe('rin:0x123456...567890')
      expect(utils.getFormattedAddress(PREFIXED_VALID_ADDRESS, true)).toBe('rin:0x123456...567890')
    })
  })
  describe('formatInputValue', () => {
    it('should return formatted addresses if the input is a valid address', () => {
      jest
        .spyOn(appearanceSelectors, 'showShortNameSelector')
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)

      expect(utils.formatInputValue(PREFIXED_VALID_ADDRESS)).toEqual(VALID_ADDRESS)
      expect(utils.formatInputValue(VALID_ADDRESS)).toEqual(VALID_ADDRESS)
      expect(utils.formatInputValue(PREFIXED_VALID_ADDRESS)).toEqual(PREFIXED_VALID_ADDRESS)
      expect(utils.formatInputValue(VALID_ADDRESS)).toEqual(PREFIXED_VALID_ADDRESS)
    })

    it('should otherwise return the value', () => {
      const value = 'notA(Prefixed)Address'

      expect(utils.formatInputValue(value)).toBe(value)
    })
  })
  describe('getFilterHelperText', () => {
    it('should return the error message if one exists', () => {
      const error = { message: 'testError', type: 'testType' }
      expect(utils.getFilterHelperText('testValue', error)).toBe('testError')
    })

    it('should return a shortened address if the value is a valid address', () => {
      jest
        .spyOn(appearanceSelectors, 'showShortNameSelector')
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(false)
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(true)

      expect(utils.getFilterHelperText(PREFIXED_VALID_ADDRESS)).toEqual('0x123456...567890')
      expect(utils.getFilterHelperText(VALID_ADDRESS)).toEqual('0x123456...567890')
      expect(utils.getFilterHelperText(PREFIXED_VALID_ADDRESS)).toEqual('rin:0x123456...567890')
      expect(utils.getFilterHelperText(VALID_ADDRESS)).toEqual('rin:0x123456...567890')
    })

    it('return otherwise return undefined', () => {
      expect(utils.getFilterHelperText('testValue')).toBe(undefined)
    })
  })
})
