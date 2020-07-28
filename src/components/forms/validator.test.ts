import {
  required,
  mustBeInteger,
  mustBeFloat,
  maxValue,
  mustBeUrl,
  minValue,
  mustBeEthereumAddress,
  minMaxLength,
  uniqueAddress,
  differentFrom,
  ADDRESS_REPEATED_ERROR,
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

  describe('mustBeEthereumAddress validator', () => {
    const MUST_BE_ETH_ADDRESS_ERR_MSG = 'Address should be a valid Ethereum address or ENS name'

    it('Returns undefined for a valid ethereum address', async () => {
      expect(await mustBeEthereumAddress('0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe')).toBeUndefined()
    })

    it('Returns an error message for an address with an invalid checksum', async () => {
      expect(await mustBeEthereumAddress('0xde0b295669a9FD93d5F28D9Ec85E40f4cb697BAe')).toEqual(
        MUST_BE_ETH_ADDRESS_ERR_MSG,
      )
    })

    it('Returns an error message for non-address string', async () => {
      expect(await mustBeEthereumAddress('notanaddress')).toEqual(MUST_BE_ETH_ADDRESS_ERR_MSG)
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
    it('Returns undefined for an address not contained in the passed array', async () => {
      const addresses = ['0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe']

      expect(uniqueAddress(addresses)('0xe7e3272a84cf3fe180345b9f7234ba705eB5E2CA')).toBeUndefined()
    })

    it('Returns an error message for an address already contained in the array', async () => {
      const addresses = ['0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe']

      expect(uniqueAddress(addresses)(addresses[0])).toEqual(ADDRESS_REPEATED_ERROR)
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
