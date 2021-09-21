import Web3 from 'web3'
import { isTxPendingError, isSmartContractWallet } from 'src/logic/wallets/getWeb3'

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

  describe('isSmartContractWallet', () => {
    const address = '0x66fb75feC6b40119e023564dF954c8794Cd876F0'

    it('checks if an address is a contract', async () => {
      const web3Provider = {
        eth: {
          getCode: jest.fn(() => Promise.resolve('Solidity code')),
        },
      } as unknown as Web3
      const result = await isSmartContractWallet(web3Provider, address)
      expect(web3Provider.eth.getCode).toHaveBeenCalledWith(address)
      expect(result).toBe(true)
    })

    it('returns false for EoA addresses', async () => {
      const web3Provider = {
        eth: {
          getCode: jest.fn(() => Promise.resolve('0x00000000000000000000')),
        },
      } as unknown as Web3
      const result = await isSmartContractWallet(web3Provider, address)
      expect(web3Provider.eth.getCode).toHaveBeenCalledWith(address)
      expect(result).toBe(false)
    })

    it('returns false for empty addresses', async () => {
      const web3Provider = {
        eth: {
          getCode: jest.fn(() => Promise.resolve('Solidity code')),
        },
      } as unknown as Web3
      const emptyAddress = ''
      const result = await isSmartContractWallet(web3Provider, emptyAddress)
      expect(web3Provider.eth.getCode).not.toHaveBeenCalled()
      expect(result).toBe(false)
    })

    it('returns false if contract code cannot be fetched', async () => {
      const web3Provider = {
        eth: {
          getCode: jest.fn(() => Promise.reject('No code')),
        },
      } as unknown as Web3
      const result = await isSmartContractWallet(web3Provider, address)
      expect(web3Provider.eth.getCode).toHaveBeenCalledWith(address)
      expect(result).toBe(false)
    })
  })
})
