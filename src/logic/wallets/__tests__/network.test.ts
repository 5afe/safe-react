import { Wallet } from 'bnc-onboard/dist/src/interfaces'

import { ChainId } from 'src/config/chain.d'
import { switchNetwork, shouldSwitchNetwork } from 'src/logic/wallets/utils/network'

class CodedError extends Error {
  public code: number
}

jest.mock('src/config', () => {
  const original = jest.requireActual('src/config')
  return {
    ...original,
    _getChainId: () => '1',
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
        name: 'Test',
      }

      expect(switchNetwork(wallet as Wallet, '1438' as unknown as ChainId)).rejects.toThrow(
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
        name: 'Test',
      }

      expect(switchNetwork(wallet as Wallet, '1438' as unknown as ChainId)).rejects.toThrow(
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
        name: 'Test',
      }

      expect(switchNetwork(wallet as Wallet, '1438' as unknown as ChainId)).resolves.toEqual(undefined)
    })

    it('should resolve to undefined if request succeeds', () => {
      const wallet = {
        provider: {
          request: jest.fn(() => Promise.resolve(true)),
        },
      }

      expect(switchNetwork(wallet as Wallet, '1438' as unknown as ChainId)).resolves.toEqual(undefined)
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
})
