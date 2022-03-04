import * as web3 from 'src/logic/wallets/getWeb3'
import * as config from 'src/config'
import { isTxPendingError, isSmartContractWallet, isHardwareWallet, isSmartContract } from 'src/logic/wallets/getWeb3'
import { Wallet } from 'bnc-onboard/dist/src/interfaces'

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
    afterEach(() => {
      jest.restoreAllMocks()
    })
    it('returns false for empty addresses', async () => {
      const emptyAddress = ''
      const result = await isSmartContractWallet(emptyAddress)
      expect(result).toBe(false)
    })
  })

  describe('isSmartContract', () => {
    afterEach(() => {
      jest.restoreAllMocks()
    })

    it('checks if an address is a contract', async () => {
      const chainId = '4'

      jest.spyOn(config, '_getChainId').mockImplementation(() => chainId)

      const getCodeSpy = jest
        .spyOn(web3.getWeb3ReadOnly().eth, 'getCode')
        .mockImplementation(jest.fn(() => Promise.resolve('Solidity code')))

      const result = await isSmartContract('0x0000000000000000000000000000000000000000', chainId)
      expect(getCodeSpy).toHaveBeenCalledWith('0x0000000000000000000000000000000000000000')
      expect(result).toBe(true)
    })

    it('returns false for EoA addresses', async () => {
      const chainId = '4'

      jest.spyOn(config, '_getChainId').mockImplementation(() => chainId)

      const getCodeSpy = jest
        .spyOn(web3.getWeb3ReadOnly().eth, 'getCode')
        .mockImplementation(jest.fn(() => Promise.resolve('0x00000000000000000000')))

      const result = await isSmartContract('0x0000000000000000000000000000000000000000', chainId)
      expect(getCodeSpy).toHaveBeenCalledWith('0x0000000000000000000000000000000000000000')
      expect(result).toBe(false)
    })

    it('returns false if contract code cannot be fetched', async () => {
      const chainId = '4'

      jest.spyOn(config, '_getChainId').mockImplementation(() => chainId)

      const getCodeSpy = jest
        .spyOn(web3.getWeb3ReadOnly().eth, 'getCode')
        .mockImplementation(jest.fn(() => Promise.reject('No code')))

      const result = await isSmartContract('0x0000000000000000000000000000000000000000', chainId)
      expect(getCodeSpy).toHaveBeenCalledWith('0x0000000000000000000000000000000000000000')
      expect(result).toBe(false)
    })
  })

  describe('isHardwareWallet', () => {
    it('should return true if the connected wallet is a supported hardware wallet', () => {
      expect(isHardwareWallet({ name: 'Ledger' } as Wallet)).toBe(true)
    })

    it('should return true if the connected wallet is of hardware type', () => {
      expect(isHardwareWallet({ type: 'hardware' } as Wallet)).toBe(true)
    })

    it('should return false if the connect wallet is not a non-hardware supported wallet', () => {
      expect(isHardwareWallet({ name: 'MetaMask' } as Wallet)).toBe(false)
    })

    it('should return false if the connect wallet is not of hardware type', () => {
      expect(isHardwareWallet({ type: 'sdk' } as Wallet)).toBe(false)
    })
  })
})
