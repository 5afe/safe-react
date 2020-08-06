import { Set, Map } from 'immutable'
import { aNewStore } from 'src/store'
import updateActiveTokens from 'src/routes/safe/store/actions/updateActiveTokens'
import '@testing-library/jest-dom/extend-expect'
import updateSafe from 'src/routes/safe/store/actions/updateSafe'
import { makeToken } from '../logic/tokens/store/model/token'
import { SAFE_REDUCER_ID } from '../routes/safe/store/reducer/safe'

describe('Feature > Balances', () => {
  let store
  const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
  beforeEach(async () => {
    store = aNewStore()
  })

  it('Updates token balances', async () => {
    // given
    const tokensAmount = '100'
    const token =  makeToken({
        address: '0x00Df91984582e6e96288307E9c2f20b38C8FeCE9',
        name: 'OmiseGo',
        symbol: 'OMG',
        decimals: 18,
        logoUri:
          'https://github.com/TrustWallet/tokens/blob/master/images/0x6810e776880c02933d47db1b9fc05908e5386b96.png?raw=true',
      })
    const balances = Map({
      [token.address]: tokensAmount,
    })
    const resultExpected = '100'

    // when
    store.dispatch(updateActiveTokens(safeAddress, Set([token.address])))
    store.dispatch(updateSafe({ address: safeAddress, balances }))

    const balanceResult = store.getState()[SAFE_REDUCER_ID].get('safes').get(safeAddress).get('balances').get(token.address)
    const activeTokens = store.getState()[SAFE_REDUCER_ID].get('safes').get(safeAddress).get('activeTokens')
    const tokenIsActive = activeTokens.has(token.address)

    // then
    expect(balanceResult).toBe(resultExpected)
    expect(tokenIsActive).toBe(true)
  })

  it('Updates ether balance', async () => {
    // given
    const etherAmount = '1'
    const resultExpected = '1'

    // when
    store.dispatch(updateSafe({ address: safeAddress, ethBalance: etherAmount }))
    const balanceResult = store.getState()[SAFE_REDUCER_ID].get('safes').get(safeAddress).get('ethBalance')

    // then
    expect(balanceResult).toBe(resultExpected)
  })
})
