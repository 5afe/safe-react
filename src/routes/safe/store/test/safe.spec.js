// @flow
import balanceReducerTests from './balance.reducer'
import safeReducerTests from './safe.reducer'
import safeSelectorTests from './safe.selector'

describe('Safe Test suite', () => {
  // ACTIONS AND REDUCERS
  safeReducerTests()
  balanceReducerTests()

  // SAFE SELECTOR
  safeSelectorTests()
})
