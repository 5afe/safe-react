// @flow
import providerReducerTests from './provider.reducer'
import providerNameTests from './name.selector'

describe('Provider Test suite', () => {
  // ACTIONS AND REDUCERS
  providerReducerTests()

  // PROVIDER NAME SELECTOR
  providerNameTests()
})
