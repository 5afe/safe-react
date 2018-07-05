// @flow
import safeReducerTests from './safe.reducer'
// import balanceSelectorTests from './balance.selector'
import safeSelectorTests from './safe.selector'
import grantedSelectorTests from './granted.selector'
import confirmationsSelectorTests from './confirmations.selector'
import transactionsSelectorTests from './transactions.selector'

describe('Safe Test suite', () => {
  // ACTIONS AND REDUCERS
  safeReducerTests()

  // SAFE SELECTOR
  safeSelectorTests()

  // BALANCE SELECTOR
  // balanceSelectorTests()

  // GRANTED SELECTOR
  grantedSelectorTests()

  // CONFIRMATIONS SELECTOR
  confirmationsSelectorTests()

  // TRANSACTIONS SELECTOR
  transactionsSelectorTests()
})
