import { Wallet } from 'bnc-onboard/dist/src/interfaces'
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
