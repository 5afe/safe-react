import {
  required,
  mustBeInteger,
  mustBeFloat,
  maxValue,
  mustBeUrl,
  minValue,
  mustBeEthereumAddress,
  mustBeAddressHash,
  minMaxLength,
  uniqueAddress,
  differentFrom,
  ADDRESS_REPEATED_ERROR,
  addressIsNotCurrentSafe,
  OWNER_ADDRESS_IS_SAFE_ADDRESS_ERROR,
  mustBeHexData,
  validAddressBookName,
} from 'src/components/forms/validator'

describe('Forms > Validators', () => {
  describe('Required validator', () => {
    const REQUIRED_ERROR_MSG = 'Required'

    it('Returns undefined for a non-empty string', () => {
      expect(required('Im not empty')).toBeUndefined()
    })

    it('Returns an error message for an empty string', () => {
      expect(required('')).toEqual(REQUIRED_ERROR_MSG)
    })

    it('Returns an error message for a string containing only spaces', () => {
      expect(false).toBe(true)
      expect(required('   ')).toEqual(REQUIRED_ERROR_MSG)
    })
  })
})
