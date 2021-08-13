import { Wallet } from 'bnc-onboard/dist/src/interfaces'
import { ETHEREUM_NETWORK } from 'src/config/networks/network'
import { switchNetwork, shouldSwitchNetwork, canSwitchNetwork } from 'src/logic/wallets/utils/network'

class CodedError extends Error {
  public code: number
}

jest.mock('src/config', () => {
  const original = jest.requireActual('src/config')
  return {
    ...original,
    getNetworkId: () => 1,
  }
})

describe('src/logic/wallets/utils/network', () => {
  describe('switchNetwork', () => {
    it('should try to add a network config if chain is unrecognized', () => {
      const wallet = {
        provider: {
          request: jest.fn(() => {
            const err = new CodedError('No such chain')
            err.code = 4902
            return Promise.reject(err)
          }),
        },
      }

      expect(switchNetwork(wallet as Wallet, '1438' as unknown as ETHEREUM_NETWORK)).rejects.toThrow(
        'Code 301: Error adding a new wallet network (No such chain)',
      )
    })

    it('should throw if provider throws', () => {
      const wallet = {
        provider: {
          request: jest.fn(() => {
            const err = new CodedError('Some error')
            err.code = 4454
            return Promise.reject(err)
          }),
        },
      }

      expect(switchNetwork(wallet as Wallet, '1438' as unknown as ETHEREUM_NETWORK)).rejects.toThrow(
        'Code 300: Error switching the wallet network (Some error)',
      )
    })

    it('should resolve to undefined when user rejects', () => {
      const wallet = {
        provider: {
          request: jest.fn(() => {
            const err = new CodedError('User rejected')
            err.code = 4001
            return Promise.reject(err)
          }),
        },
      }

      expect(switchNetwork(wallet as Wallet, '1438' as unknown as ETHEREUM_NETWORK)).resolves.toEqual(undefined)
    })

    it('should resolve to undefined if request succeeds', () => {
      const wallet = {
        provider: {
          request: jest.fn(() => Promise.resolve(true)),
        },
      }

      expect(switchNetwork(wallet as Wallet, '1438' as unknown as ETHEREUM_NETWORK)).resolves.toEqual(undefined)
    })
  })
  describe('shouldSwitchNetwork', () => {
    it('should return true when networks mismatch', () => {
      const wallet = {
        provider: {
          networkVersion: '4',
        },
      }

      expect(shouldSwitchNetwork(wallet as Wallet)).toBe(true)
    })

    it('should return false when wallet is not connected', () => {
      const wallet = {
        provider: undefined,
      }

      expect(shouldSwitchNetwork(wallet as Wallet)).toBe(false)
    })

    it('should return false when networks are the same', () => {
      const wallet = {
        provider: {
          networkVersion: '1',
        },
      }

      expect(shouldSwitchNetwork(wallet as Wallet)).toBe(false)
    })
  })

  describe('canSwitchNetwork', () => {
    it('should return true when swithcing is supported', () => {
      const wallet = {
        provider: {
          isMetaMask: true,
        },
      }

      expect(canSwitchNetwork(wallet as Wallet)).toBe(true)
    })

    it('should return false when swithcing is not supported', () => {
      const wallet = {
        provider: undefined,
      }

      expect(canSwitchNetwork(wallet as Wallet)).toBe(false)
    })
  })
})
