import * as web3 from 'src/logic/wallets/getWeb3'
import { _setChainId } from 'src/config'
import { isTxPendingError, isSmartContractWallet, isHardwareWallet } from 'src/logic/wallets/getWeb3'
import { CHAIN_ID } from 'src/config/chain.d'

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
    it.skip('should only call the RPC if the chain changes', async () => {
      web3ReadOnly.eth.getCode = jest.fn(() => Promise.resolve('Solidity code'))

      await isSmartContractWallet('0x0000000000000000000000000000000000000005')
      expect(web3ReadOnly).toHaveBeenCalledTimes(1)
      _setChainId(CHAIN_ID.VOLTA)
      await isSmartContractWallet('0x0000000000000000000000000000000000000005')
      expect(web3ReadOnly).toHaveBeenCalledTimes(1)
    })

    it.skip("should not call the RPC again if the address/chain doesn't change", async () => {
      web3ReadOnly.eth.getCode = jest.fn(() => Promise.resolve('Solidity code'))

      await isSmartContractWallet('0x0000000000000000000000000000000000000006')
      await isSmartContractWallet('0x0000000000000000000000000000000000000006')
      await isSmartContractWallet('0x0000000000000000000000000000000000000006')
      await isSmartContractWallet('0x0000000000000000000000000000000000000006')
      await isSmartContractWallet('0x0000000000000000000000000000000000000006')
      expect(web3ReadOnly.eth.getCode).toHaveBeenCalledTimes(1)
    })
  })

  describe.skip('isHardwareWallet', () => {
    it('should return true if the connected wallet is a supported hardware wallet', () => {
      jest.mock('bnc-onboard', () => () => ({
        getState: () => ({ appNetworkId: 4, wallet: { type: 'Ledger' } }),
      }))

      expect(isHardwareWallet()).toBe(true)
    })

    jest.mock('bnc-onboard', () => () => ({
      getState: () => ({ appNetworkId: 4, wallet: { type: 'hardware' } }),
    }))
    it('should return true if the connected wallet is of hardware type', () => {
      expect(isHardwareWallet()).toBe(true)
    })

    jest.mock('bnc-onboard', () => () => ({
      getState: () => ({ appNetworkId: 4, wallet: { name: 'MetaMask' } }),
    }))
    it('should return false if the connect wallet is not a non-hardware supported wallet', () => {
      expect(isHardwareWallet()).toBe(false)
    })

    jest.mock('bnc-onboard', () => () => ({
      getState: () => ({ appNetworkId: 4, wallet: { type: 'sdk' } }),
    }))
    it('should return false if the connect wallet is not of hardware type', () => {
      expect(isHardwareWallet()).toBe(false)
    })
  })
})
