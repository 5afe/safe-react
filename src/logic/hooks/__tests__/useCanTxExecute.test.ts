import { calculateCanTxExecute } from '../useCanTxExecute'

describe('useCanTxExecute tests', () => {
  describe('calculateCanTxExecute test', () => {
    beforeEach(() => {
      hasQueueNextTx = false
      currentSafeNonce = 8
      recommendedNonce = 8
    })
    // to be overriden as necessary
    let threshold
    let preApprovingOwner
    let txConfirmations
    let txType
    let currentSafeNonce
    let recommendedNonce
    let hasQueueNextTx
    it(`should return false there are queued txs`, () => {
      // given
      hasQueueNextTx = true

      // when
      const result = calculateCanTxExecute(
        currentSafeNonce,
        hasQueueNextTx,
        preApprovingOwner,
        threshold,
        txConfirmations,
        recommendedNonce,
      )

      // then
      expect(result).toBe(false)
    })
    it(`should return true if the safe threshold is 1 and no queued txs`, () => {
      // given
      threshold = 1
      currentSafeNonce = 8
      recommendedNonce = 8
      hasQueueNextTx = false

      // when
      const result = calculateCanTxExecute(
        currentSafeNonce,
        hasQueueNextTx,
        preApprovingOwner,
        threshold,
        txConfirmations,
        recommendedNonce,
      )

      // then
      expect(result).toBe(true)
    })
    it(`should return false if the safe threshold is 1 and there are queued txs`, () => {
      // given
      threshold = 1
      currentSafeNonce = 8
      recommendedNonce = 8
      hasQueueNextTx = true

      // when
      const result = calculateCanTxExecute(
        currentSafeNonce,
        hasQueueNextTx,
        preApprovingOwner,
        threshold,
        txConfirmations,
        recommendedNonce,
      )

      // then
      expect(result).toBe(false)
    })

    it(`should return false if the safe threshold is 1, there are no queued txs but recommendedNonce does not match safeNonce`, () => {
      // given
      threshold = 1
      currentSafeNonce = 8
      recommendedNonce = 10

      // when
      const result = calculateCanTxExecute(
        currentSafeNonce,
        hasQueueNextTx,
        preApprovingOwner,
        threshold,
        txConfirmations,
        recommendedNonce,
      )

      // then
      expect(result).toBe(false)
    })
    it(`should return true if the safe threshold is reached for the transaction`, () => {
      // given
      threshold = 3
      txConfirmations = 3

      // when
      const result = calculateCanTxExecute(
        currentSafeNonce,
        hasQueueNextTx,
        preApprovingOwner,
        threshold,
        txConfirmations,
        recommendedNonce,
      )

      // then
      expect(result).toBe(true)
    })
    it.skip(`should return true if the transaction is spendingLimit`, () => {
      // given
      txType = 'spendingLimit'

      // when
      const result = calculateCanTxExecute(
        currentSafeNonce,
        hasQueueNextTx,
        preApprovingOwner,
        threshold,
        txConfirmations,
        recommendedNonce,
      )

      // then
      expect(result).toBe(true)
    })
    it.skip(`should return false if the number of confirmations meets the threshold but txNonce > safeNonce`, () => {
      // given
      threshold = 5
      txConfirmations = 5
      currentSafeNonce = 8
      recommendedNonce = 10

      // when
      const result = calculateCanTxExecute(
        currentSafeNonce,
        hasQueueNextTx,
        preApprovingOwner,
        threshold,
        txConfirmations,
        recommendedNonce,
      )

      // then
      expect(result).toBe(false)
    })
    it(`should return false if the number of confirmations does not meet the threshold and there is no preApprovingOwner`, () => {
      // given
      threshold = 5
      txConfirmations = 4

      // when
      const result = calculateCanTxExecute(
        currentSafeNonce,
        hasQueueNextTx,
        preApprovingOwner,
        threshold,
        txConfirmations,
        recommendedNonce,
      )

      // then
      expect(result).toBe(false)
    })
    it(`should return true if the number of confirmations is one bellow the threshold but there is a preApprovingOwner`, () => {
      // given
      threshold = 5
      preApprovingOwner = '0x29B1b813b6e84654Ca698ef5d7808E154364900B'
      txConfirmations = 4

      // when
      const result = calculateCanTxExecute(
        currentSafeNonce,
        hasQueueNextTx,
        preApprovingOwner,
        threshold,
        txConfirmations,
        recommendedNonce,
      )

      // then
      expect(result).toBe(true)
    })
  })
})
