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
} from 'src/components/forms/validator'

describe('Forms > Validators', () => {
  describe('Required validator', () => {
    it('Returns undefined for a non-empty string', () => {
      expect(required('Im not empty')).toBeUndefined()
    })

    it('Returns an error message for an empty string', () => {
      expect(required('')).toBeDefined()
    })

    it('Returns an error message for a string containing only spaces', () => {
      expect(required('   ')).toBeDefined()
    })
  })

  describe('mustBeInteger validator', () => {
    it('Returns undefined for an integer number string', () => {
      expect(mustBeInteger('10')).toBeUndefined()
    })

    it('Returns an error message for a float number', () => {
      expect(mustBeInteger('1.0')).toBeDefined()
    })

    it('Returns an error message for a non-number string', () => {
      expect(mustBeInteger('iamnotanumber')).toBeDefined()
    })
  })

  describe('mustBeFloat validator', () => {
    it('Returns undefined for a float number string', () => {
      expect(mustBeFloat('1.0')).toBeUndefined()
    })

    it('Returns an error message for a non-number string', () => {
      expect(mustBeFloat('iamnotanumber')).toBeDefined()
    })
  })

  describe('minValue validator', () => {
    it('Returns undefined for a number greater than minimum', () => {
      const minimum = Math.random()
      const number = (minimum + 1).toString()

      expect(minValue(minimum)(number)).toBeUndefined()
    })

    it('Returns an error message for a number less than minimum', () => {
      const minimum = Math.random()
      const number = (minimum - 1).toString()

      expect(minValue(minimum)(number)).toBeDefined()
    })

    it('Returns an error message for a number equal to minimum with false inclusive param', () => {
      const minimum = Math.random()
      const number = (minimum - 1).toString()

      expect(minValue(minimum, false)(number)).toBeDefined()
    })

    it('Returns an error message for a non-number string', () => {
      expect(minValue(1)('imnotanumber')).toBeDefined()
    })
  })

  describe('mustBeUrl validator', () => {
    it('Returns undefined for a valid url', () => {
      expect(mustBeUrl('https://gnosis-safe.io')).toBeUndefined()
    })

    it('Returns an error message for an valid url', () => {
      expect(mustBeUrl('gnosis-safe')).toBeDefined()
    })
  })

  describe('maxValue validator', () => {
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

      expect(maxValue(max)(number)).toBeDefined()
    })

    it('Returns an error message for a non-number string', () => {
      expect(maxValue(1)('imnotanumber')).toBeDefined()
    })
  })

  describe('mustBeEthereumAddress validator', () => {
    it('Returns undefined for a valid ethereum address', async () => {
      expect(await mustBeEthereumAddress('0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe')).toBeUndefined()
    })

    it('Returns an error message for an address with an invalid checksum', async () => {
      expect(await mustBeEthereumAddress('0xde0b295669a9FD93d5F28D9Ec85E40f4cb697BAe')).toBeDefined()
    })

    it('Returns an error message for non-address string', async () => {
      expect(await mustBeEthereumAddress('notanaddress')).toBeDefined()
    })
  })

  describe('minMaxLength validator', () => {
    it('Returns undefined for a string between minimum and maximum length', async () => {
      expect(minMaxLength(1, 10)('length7')).toBeUndefined()
    })

    it('Returns an error message for a string with length greater than maximum', async () => {
      expect(minMaxLength(1, 5)('length7')).toBeDefined()
    })

    it('Returns an error message for a string with length less than minimum', async () => {
      expect(minMaxLength(7, 10)('string')).toBeDefined()
    })
  })

  describe('uniqueAddress validator', () => {
    it('Returns undefined for an address not contained in the passed array', async () => {
      const addresses = ['0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe']

      expect(uniqueAddress(addresses)('0xe7e3272a84cf3fe180345b9f7234ba705eB5E2CA')).toBeUndefined()
    })

    it('Returns an error message for an address already contained in the array', async () => {
      const addresses = ['0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe']

      expect(uniqueAddress(addresses)(addresses[0])).toBeDefined()
    })
  })

  describe('differentFrom validator', () => {
    it('Returns undefined for different values', async () => {
      expect(differentFrom('a')('b')).toBeUndefined()
    })

    it('Returns an error message for equal values', async () => {
      expect(differentFrom('a')('a')).toBeDefined()
    })
  })
})
