// @flow
import safeReducerTests from './safe.reducer'
import safeSelectorTests from './safe.selector'

describe('Safe Test suite', () => {
  // ACTIONS AND REDUCERS
  safeReducerTests()

  // SAFE SELECTOR
  safeSelectorTests()
})
