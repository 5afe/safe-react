import * as appearanceSelectors from 'src/logic/appearance/selectors'
import { FilterType } from '..'
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
  describe('isTxFilter', () => {
    const filterKeys = [
      'type',
      'execution_date__gte',
      'execution_date__lte',
      'to',
      'value',
      'token_address',
      'module',
      'nonce',
    ]
    it('should return true if the object has only valid filter keys', () => {
      filterKeys.forEach((key) => {
        expect(utils.isTxFilter({ [key]: 'test' })).toBe(true)
      })
    })

    it('should return true if the object has a valid filter key', () => {
      filterKeys.forEach((key, i) => {
        const str = i.toString()
        expect(utils.isTxFilter({ str, [key]: 'test' })).toBe(true)
      })
    })

    it('should return true if the object has only invalid filter keys', () => {
      expect(utils.isTxFilter({ test: 'test' })).toBe(false)
    })
  })

  describe('getIncomingFilter', () => {
    it('should extract the incoming filter values from the filter, correctly formatted', () => {
      const filter = {
        execution_date__gte: '1970-01-01',
        execution_date__lte: '2000-01-01',
        type: FilterType.INCOMING,
        value: '123',
      }

      expect(utils.getIncomingFilter(filter)).toEqual({
        execution_date__gte: '1970-01-01T00:00:00.000Z',
        execution_date__lte: '2000-01-01T00:00:00.000Z',
        value: '123000000000000000000',
      })
    })
  })
  describe('getMultisigFilter', () => {
    it('should extract the incoming filter values from the filter, correctly formatted', () => {
      const filter = {
        __to: 'fakeaddress.eth',
        to: '0x1234567890123456789012345678901234567890',
        execution_date__gte: '1970-01-01',
        execution_date__lte: '2000-01-01',
        type: FilterType.MULTISIG,
        value: '123',
        nonce: '123',
      }

      expect(utils.getMultisigFilter(filter)).toEqual({
        to: '0x1234567890123456789012345678901234567890',
        execution_date__gte: '1970-01-01T00:00:00.000Z',
        execution_date__lte: '2000-01-01T00:00:00.000Z',
        value: '123000000000000000000',
        nonce: '123',
      })
    })
    it('should add the executed param if defined', () => {
      const filter = {
        __to: 'fakeaddress.eth',
        to: '0x1234567890123456789012345678901234567890',
        execution_date__gte: '1970-01-01',
        execution_date__lte: '2000-01-01',
        type: FilterType.MULTISIG,
        value: '123',
        nonce: '123',
      }

      expect(utils.getMultisigFilter(filter, true)).toEqual({
        to: '0x1234567890123456789012345678901234567890',
        execution_date__gte: '1970-01-01T00:00:00.000Z',
        execution_date__lte: '2000-01-01T00:00:00.000Z',
        value: '123000000000000000000',
        nonce: '123',
        executed: 'true',
      })
    })
  })
  describe('getModuleFilter', () => {
    it('should extract the incoming filter values from the filter, correctly formatted', () => {
      const filter = {
        __module: 'fakeaddress.eth',
        to: '0x1234567890123456789012345678901234567890',
        module: '0x1234567890123456789012345678901234567890',
        type: FilterType.MODULE,
      }

      expect(utils.getModuleFilter(filter)).toEqual({
        to: '0x1234567890123456789012345678901234567890',
        module: '0x1234567890123456789012345678901234567890',
      })
    })
  })
})
