import Web3 from 'web3'
import { isTxPendingError, isSmartContractWallet, getWeb3ReadOnly } from 'src/logic/wallets/getWeb3'

describe('src/logic/wallets/getWeb3', () => {
  describe('isTxPendingError', () => {
    it('should return true for tx not mined error', () => {
      const err = new Error('Transaction was not mined within 50 blocks')
      expect(isTxPendingError(err)).toBe(true)
    })

    it('should return false for other error types', () => {
      const err = new Error('Transaction has been reverted by the EVM')
      expect(isTxPendingError(err)).toBe(false)
    })
  })

  jest.mock('src/logic/wallets/getWeb3', () => ({
    getWeb3ReadOnly: jest.fn(),
  }))

  describe('isSmartContractWallet', () => {
    const web3ReadOnly = getWeb3ReadOnly()
    const address = '0x66fb75feC6b40119e023564dF954c8794Cd876F0'

    it('checks if an address is a contract', async () => {
      web3ReadOnly.eth.getCode = jest.fn(() => Promise.resolve('Solidity code'))

      const result = await isSmartContractWallet(address)
      expect(web3ReadOnly.eth.getCode).toHaveBeenCalledWith(address)
      expect(result).toBe(true)
    })

    it('returns false for EoA addresses', async () => {
      web3ReadOnly.eth.getCode = jest.fn(() => Promise.resolve('0x00000000000000000000'))

      const result = await isSmartContractWallet(address)
      expect(web3ReadOnly.eth.getCode).toHaveBeenCalledWith(address)
      expect(result).toBe(false)
    })

    it('returns false for empty addresses', async () => {
      web3ReadOnly.eth.getCode = jest.fn(() => Promise.resolve('Solidity code'))

      const emptyAddress = ''
      const result = await isSmartContractWallet(emptyAddress)
      expect(web3ReadOnly.eth.getCode).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it('returns false if contract code cannot be fetched', async () => {
      web3ReadOnly.eth.getCode = jest.fn(() => Promise.reject('No code'))

      const result = await isSmartContractWallet(address)
      expect(web3ReadOnly.eth.getCode).toHaveBeenCalledWith(address)
      expect(result).toBe(false)
    })
  })
})
