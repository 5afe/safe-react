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
      expect(required('   ')).toEqual(REQUIRED_ERROR_MSG)
    })
  })

  describe('mustBeInteger validator', () => {
    const MUST_BE_INTEGER_ERROR_MSG = 'Must be an integer'

    it('Returns undefined for an integer number string', () => {
      expect(mustBeInteger('10')).toBeUndefined()
    })

    it('Returns an error message for a float number', () => {
      expect(mustBeInteger('1.0')).toEqual(MUST_BE_INTEGER_ERROR_MSG)
    })

    it('Returns an error message for a non-number string', () => {
      expect(mustBeInteger('iamnotanumber')).toEqual(MUST_BE_INTEGER_ERROR_MSG)
    })
  })

  describe('mustBeFloat validator', () => {
    const MUST_BE_FLOAT_ERR_MSG = 'Must be a number'

    it('Returns undefined for a float number string', () => {
      expect(mustBeFloat('1.0')).toBeUndefined()
    })

    it('Returns an error message for a non-number string', () => {
      expect(mustBeFloat('iamnotanumber')).toEqual(MUST_BE_FLOAT_ERR_MSG)
    })
  })

  describe('minValue validator', () => {
    const getMinValueErrMsg = (minValue: number, inclusive = true): string =>
      `Should be greater than ${inclusive ? 'or equal to ' : ''}${minValue}`

    it('Returns undefined for a number greater than minimum', () => {
      const minimum = Math.random()
      const number = (minimum + 1).toString()

      expect(minValue(minimum)(number)).toBeUndefined()
    })

    it('Returns an error message for a number less than minimum', () => {
      const minimum = Math.random()
      const number = (minimum - 1).toString()

      expect(minValue(minimum)(number)).toEqual(getMinValueErrMsg(minimum))
    })

    it('Returns an error message for a number equal to minimum with false inclusive param', () => {
      const minimum = Math.random()
      const number = (minimum - 1).toString()

      expect(minValue(minimum, false)(number)).toEqual(getMinValueErrMsg(minimum, false))
    })

    it('Returns an error message for a non-number string', () => {
      expect(minValue(1)('imnotanumber')).toEqual(getMinValueErrMsg(1))
    })
  })

  describe('mustBeUrl validator', () => {
    const MUST_BE_URL_ERR_MSG = 'Please, provide a valid url'

    it('Returns undefined for a valid url', () => {
      expect(mustBeUrl('https://gnosis-safe.io')).toBeUndefined()
    })

    it('Returns an error message for an valid url', () => {
      expect(mustBeUrl('gnosis-safe')).toEqual(MUST_BE_URL_ERR_MSG)
    })
  })

  describe('maxValue validator', () => {
    const getMaxValueErrMsg = (maxValue: number): string => `Maximum value is ${maxValue}`

    it('Returns undefined for a number less than maximum', () => {
      const max = Math.random()
      const number = (max - 1).toString()

      expect(maxValue(max)(number)).toBeUndefined()
    })

    it('Returns undefined for a number equal to maximum', () => {
      const max = Math.random()

      expect(maxValue(max)(max.toString())).toBeUndefined()
    })

    it('Returns an error message for a number greater than maximum', () => {
      const max = Math.random()
      const number = (max + 1).toString()

      expect(maxValue(max)(number)).toEqual(getMaxValueErrMsg(max))
    })

    it('Returns an error message for a non-number string', () => {
      expect(maxValue(1)('imnotanumber')).toEqual(getMaxValueErrMsg(1))
    })
  })

  describe('mustBeHexData validator', () => {
    const MUST_BE_HEX_DATA_ERROR_MSG = 'Has to be a valid strict hex data (it must start with 0x)'

    it('should return undefined for `0x`', function () {
      expect(mustBeHexData('0x')).toBeUndefined()
    })

    it('should return undefined for an address', function () {
      expect(mustBeHexData('0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe')).toBeUndefined()
    })

    it('should return undefined for a valid hex string', function () {
      expect(
        mustBeHexData(
          '0x095ea7b30000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488d0000000000000000000000000000000000000000000000000000000000000000',
        ),
      ).toBeUndefined()
    })

    it('should return an error message for an empty string', function () {
      expect(mustBeHexData('')).toEqual(MUST_BE_HEX_DATA_ERROR_MSG)
    })

    it('should return the error message for a non-strict hex string', function () {
      expect(mustBeHexData('0')).toEqual(MUST_BE_HEX_DATA_ERROR_MSG)
    })
  })
  describe('mustBeAddressHash validator', () => {
    const MUST_BE_ETH_ADDRESS_ERR_MSG = 'Must be a valid address'

    it('Returns undefined for a valid ethereum address', async () => {
      expect(await mustBeAddressHash('0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe')).toBeUndefined()
    })

    it('Returns an error message for an address with an invalid checksum', async () => {
      expect(await mustBeAddressHash('0xde0b295669a9FD93d5F28D9Ec85E40f4cb697BAe')).toEqual(MUST_BE_ETH_ADDRESS_ERR_MSG)
    })

    it('Returns an error message for non-address and non-domain string', async () => {
      expect(await mustBeAddressHash('notanaddress')).toEqual(MUST_BE_ETH_ADDRESS_ERR_MSG)
    })
  })

  describe('mustBeEthereumAddress validator', () => {
    const MUST_BE_ETH_ADDRESS_OR_DOMAIN_ERR_MSG = 'Must be a valid address, ENS or Unstoppable domain'

    it('Returns undefined for a valid ethereum address', async () => {
      expect(await mustBeEthereumAddress('0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe')).toBeUndefined()
    })

    it('Returns an error message for an address with an invalid checksum', async () => {
      expect(await mustBeEthereumAddress('0xde0b295669a9FD93d5F28D9Ec85E40f4cb697BAe')).toEqual(
        MUST_BE_ETH_ADDRESS_OR_DOMAIN_ERR_MSG,
      )
    })
  })

  describe('minMaxLength validator', () => {
    const getMinMaxLenErrMsg = (minLen: number, maxLen: number): string => `Should be ${minLen} to ${maxLen} symbols`

    it('Returns undefined for a string between minimum and maximum length', async () => {
      expect(minMaxLength(1, 10)('length7')).toBeUndefined()
    })

    it('Returns an error message for a string with length greater than maximum', async () => {
      const minMaxLengths: [number, number] = [1, 5]

      expect(minMaxLength(...minMaxLengths)('length7')).toEqual(getMinMaxLenErrMsg(...minMaxLengths))
    })

    it('Returns an error message for a string with length less than minimum', async () => {
      const minMaxLengths: [number, number] = [7, 10]

      expect(minMaxLength(...minMaxLengths)('string')).toEqual(getMinMaxLenErrMsg(...minMaxLengths))
    })
  })

  describe('uniqueAddress validator', () => {
    it('Returns undefined if `addresses` does not contains the provided address', async () => {
      const addresses = ['0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe']

      expect(uniqueAddress(addresses)('0x2D6F2B448b0F711Eb81f2929566504117d67E44F')).toBeUndefined()
    })

    it('Returns an error message if address is in the `addresses` list already', async () => {
      const addresses = ['0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe', '0x2D6F2B448b0F711Eb81f2929566504117d67E44F']

      expect(uniqueAddress(addresses)('0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe')).toEqual(ADDRESS_REPEATED_ERROR)
    })
  })

  describe('addressIsNotSafe validator', () => {
    it('Returns undefined if the given `address` it not the given `safeAddress`', async () => {
      const address = '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
      const safeAddress = '0x2D6F2B448b0F711Eb81f2929566504117d67E44F'

      expect(addressIsNotCurrentSafe(safeAddress)(address)).toBeUndefined()
    })

    it('Returns an error message if the given `address` is the same as the `safeAddress`', async () => {
      const address = '0x2D6F2B448b0F711Eb81f2929566504117d67E44F'
      const safeAddress = '0x2D6F2B448b0F711Eb81f2929566504117d67E44F'

      expect(addressIsNotCurrentSafe(safeAddress)(address)).toEqual(OWNER_ADDRESS_IS_SAFE_ADDRESS_ERROR)
    })
  })

  describe('differentFrom validator', () => {
    const getDifferentFromErrMsg = (diffValue: string): string => `Value should be different than ${diffValue}`

    it('Returns undefined for different values', async () => {
      expect(differentFrom('a')('b')).toBeUndefined()
    })

    it('Returns an error message for equal values', async () => {
      expect(differentFrom('a')('a')).toEqual(getDifferentFromErrMsg('a'))
    })
  })
})
