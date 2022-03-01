import * as web3 from 'src/logic/wallets/getWeb3'
import * as config from 'src/config'
import { isTxPendingError, isSmartContractWallet, isHardwareWallet } from 'src/logic/wallets/getWeb3'
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
    const web3ReadOnly = web3.getWeb3ReadOnly()
    // Address has to change in each test because of memoization cache in memory

    it('checks if an address is a contract', async () => {
      web3ReadOnly.eth.getCode = jest.fn(() => Promise.resolve('Solidity code'))

      const result = await isSmartContractWallet('0x0000000000000000000000000000000000000000')
      expect(web3ReadOnly.eth.getCode).toHaveBeenCalledWith('0x0000000000000000000000000000000000000000')
      expect(result).toBe(true)
    })

    it('returns false for EoA addresses', async () => {
      web3ReadOnly.eth.getCode = jest.fn(() => Promise.resolve('0x00000000000000000000'))

      const result = await isSmartContractWallet('0x0000000000000000000000000000000000000001')
      expect(web3ReadOnly.eth.getCode).toHaveBeenCalledWith('0x0000000000000000000000000000000000000001')
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

      const result = await isSmartContractWallet('0x0000000000000000000000000000000000000002')
      expect(web3ReadOnly.eth.getCode).toHaveBeenCalledWith('0x0000000000000000000000000000000000000002')
      expect(result).toBe(false)
    })

    it('should only call the RPC if the address changes', async () => {
      web3ReadOnly.eth.getCode = jest.fn(() => Promise.resolve('Solidity code'))

      await isSmartContractWallet('0x0000000000000000000000000000000000000003')
      await isSmartContractWallet('0x0000000000000000000000000000000000000004')
      expect(web3ReadOnly.eth.getCode).toHaveBeenCalledTimes(2)
    })
    it('should only call the RPC if the chain changes', async () => {
      jest
        .spyOn(config, '_getChainId')
        .mockImplementationOnce(() => '4')
        .mockImplementationOnce(() => '5')

      const getCodeMock = jest.fn(() => Promise.resolve('Solidity code'))
      jest.spyOn(web3.getWeb3ReadOnly().eth, 'getCode').mockImplementation(getCodeMock)

      await isSmartContractWallet('0x0000000000000000000000000000000000000005')
      expect(getCodeMock).toHaveBeenCalledTimes(1)

      await isSmartContractWallet('0x0000000000000000000000000000000000000005')
      expect(getCodeMock).toHaveBeenCalledTimes(2)
    })

    it("should not call the RPC again if the address/chain doesn't change", async () => {
      web3ReadOnly.eth.getCode = jest.fn(() => Promise.resolve('Solidity code'))

      await isSmartContractWallet('0x0000000000000000000000000000000000000006')
      await isSmartContractWallet('0x0000000000000000000000000000000000000006')
      await isSmartContractWallet('0x0000000000000000000000000000000000000006')
      await isSmartContractWallet('0x0000000000000000000000000000000000000006')
      await isSmartContractWallet('0x0000000000000000000000000000000000000006')
      expect(web3ReadOnly.eth.getCode).toHaveBeenCalledTimes(1)
    })
  })

  describe('isHardwareWallet', () => {
    it('should return true if the connected wallet is a supported hardware wallet', () => {
      expect(isHardwareWallet({ wallet: { name: 'Ledger' } } as any as Wallet)).toBe(true)
    })

    it('should return true if the connected wallet is of hardware type', () => {
      expect(isHardwareWallet({ wallet: { type: 'hardware' } } as any as Wallet)).toBe(true)
    })

    it('should return false if the connect wallet is not a non-hardware supported wallet', () => {
      expect(isHardwareWallet({ wallet: { name: 'MetaMask' } } as any as Wallet)).toBe(false)
    })

    it('should return false if the connect wallet is not of hardware type', () => {
      expect(isHardwareWallet({ wallet: { type: 'sdk' } } as any as Wallet)).toBe(false)
    })
  })
})
