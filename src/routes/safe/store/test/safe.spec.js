// @flow
import balanceReducerTests from './balance.reducer'
import safeReducerTests from './safe.reducer'
import dailyLimitReducerTests from './dailyLimit.reducer'
import thresholdReducerTests from './threshold.reducer'
import balanceSelectorTests from './balance.selector'
import safeSelectorTests from './safe.selector'
import grantedSelectorTests from './granted.selector'
import confirmationsSelectorTests from './confirmations.selector'
import transactionsSelectorTests from './transactions.selector'

describe('Safe Test suite', () => {
  // ACTIONS AND REDUCERS
  safeReducerTests()
  balanceReducerTests()
  dailyLimitReducerTests()
  thresholdReducerTests()

  // SAFE SELECTOR
  safeSelectorTests()

  // BALANCE SELECTOR
  balanceSelectorTests()

  // GRANTED SELECTOR
  grantedSelectorTests()

  // CONFIRMATIONS SELECTOR
  confirmationsSelectorTests()

  // TRANSACTIONS SELECTOR
  transactionsSelectorTests()
})
