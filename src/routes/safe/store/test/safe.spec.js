// @flow
import balanceReducerTests from './balance.reducer'
import safeReducerTests from './safe.reducer'
import dailyLimitReducerTests from './dailyLimit.reducer'
import balanceSelectorTests from './balance.selector'
import safeSelectorTests from './safe.selector'
import grantedSelectorTests from './granted.selector'

describe('Safe Test suite', () => {
  // ACTIONS AND REDUCERS
  safeReducerTests()
  balanceReducerTests()
  dailyLimitReducerTests()

  // SAFE SELECTOR
  safeSelectorTests()

  // BALANCE SELECTOR
  balanceSelectorTests()

  // GRANTED SELECTOR
  grantedSelectorTests()
})
