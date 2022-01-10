import { calculateCanTxExecute } from '../useCanTxExecute'

describe('useCanTxExecute tests', () => {
  describe('calculateCanTxExecute tests', () => {
    beforeEach(() => {
      threshold = 1
      isExecution = false
      currentSafeNonce = 8
      recommendedNonce = 8
      txConfirmations = 0
      preApprovingOwner = ''
      manualSafeNonce = recommendedNonce
    })
    // to be overriden as necessary
    let threshold
    let preApprovingOwner
    let txConfirmations
    let currentSafeNonce
    let recommendedNonce
    let isExecution
    let manualSafeNonce
    it(`should return true if isExecution`, () => {
      // given
      isExecution = true

      // when
      const result = calculateCanTxExecute(
        currentSafeNonce,
        preApprovingOwner,
        threshold,
        txConfirmations,
        recommendedNonce,
        isExecution,
      )

      // then
      expect(result).toBe(true)
    })
    it(`should return true if single owner and edited nonce is same as safeNonce`, () => {
      // given
      threshold = 1
      currentSafeNonce = 8
      recommendedNonce = 12
      manualSafeNonce = 8

      // when
      const result = calculateCanTxExecute(
        currentSafeNonce,
        preApprovingOwner,
        threshold,
        txConfirmations,
        recommendedNonce,
        undefined,
        manualSafeNonce,
      )

      // then
      expect(result).toBe(true)
    })
    it(`should return false if single owner and edited nonce is different than safeNonce`, () => {
      // given
      threshold = 1
      currentSafeNonce = 8
      recommendedNonce = 8
      manualSafeNonce = 20

      // when
      const result = calculateCanTxExecute(
        currentSafeNonce,
        preApprovingOwner,
        threshold,
        txConfirmations,
        recommendedNonce,
        undefined,
        manualSafeNonce,
      )

      // then
      expect(result).toBe(false)
    })
    it(`should return true if single owner and recommendedNonce is same as safeNonce`, () => {
      // given
      threshold = 1
      currentSafeNonce = 8
      recommendedNonce = 8

      // when
      const result = calculateCanTxExecute(
        currentSafeNonce,
        preApprovingOwner,
        threshold,
        txConfirmations,
        recommendedNonce,
      )

      // then
      expect(result).toBe(true)
    })
    it(`should return false if single owner and recommendedNonce is greater than safeNonce and no edited nonce`, () => {
      // given
      threshold = 1
      currentSafeNonce = 8
      recommendedNonce = 11
      manualSafeNonce = undefined

      // when
      const result = calculateCanTxExecute(
        currentSafeNonce,
        preApprovingOwner,
        threshold,
        txConfirmations,
        recommendedNonce,
        undefined,
        manualSafeNonce,
      )

      // then
      expect(result).toBe(false)
    })
    it(`should return false if single owner and recommendedNonce is different than safeNonce`, () => {
      // given
      threshold = 1
      currentSafeNonce = 8
      recommendedNonce = 12

      // when
      const result = calculateCanTxExecute(
        currentSafeNonce,
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
        preApprovingOwner,
        threshold,
        txConfirmations,
        recommendedNonce,
      )

      // then
      expect(result).toBe(true)
    })
    it(`should return false if the number of confirmations does not meet the threshold and there is no preApprovingOwner`, () => {
      // given
      threshold = 5
      txConfirmations = 4

      // when
      const result = calculateCanTxExecute(
        currentSafeNonce,
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
