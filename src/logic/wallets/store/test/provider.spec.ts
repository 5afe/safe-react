// 
import providerReducerTests from './provider.reducer'
import providerNameTests from './name.selector'
import providerAccountTests from './account.selector'

describe('Provider Test suite', () => {
  // ACTIONS AND REDUCERS
  providerReducerTests()

  // PROVIDER NAME SELECTOR
  providerNameTests()
  // PROVIDER ACCOUNT SELECTOR
  providerAccountTests()
})
