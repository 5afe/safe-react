import { Wallet } from 'bnc-onboard/dist/src/interfaces'
import { switchNetwork } from 'src/logic/wallets/utils/network'

class CodedError extends Error {
  public code: number
}

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

      expect(switchNetwork(wallet as Wallet, 1438)).rejects.toThrow(
        'Code 301: Error adding a new wallet network (No such chain)',
      )
    })

    it('should throw if provider throws', () => {
      const wallet = {
        provider: {
          request: jest.fn(() => {
            const err = new CodedError('User rejected')
            err.code = 4001
            return Promise.reject(err)
          }),
        },
      }

      expect(switchNetwork(wallet as Wallet, 1438)).rejects.toThrow(
        'Code 300: Error switching the wallet network (User rejected)',
      )
    })

    it('should resolve to undefined if request succeeds', () => {
      const wallet = {
        provider: {
          request: jest.fn(() => Promise.resolve(true)),
        },
      }

      expect(switchNetwork(wallet as Wallet, 1438)).resolves.toEqual(undefined)
    })
  })
})
