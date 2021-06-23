import { isTxPendingError } from 'src/logic/wallets/getWeb3'

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
})
