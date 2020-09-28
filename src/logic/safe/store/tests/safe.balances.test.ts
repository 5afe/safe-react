import { Set, Map } from 'immutable'
import { aNewStore } from 'src/store'
import updateActiveTokens from 'src/logic/safe/store/actions/updateActiveTokens'
import '@testing-library/jest-dom/extend-expect'
import updateSafe from 'src/logic/safe/store/actions/updateSafe'
import { makeToken } from 'src/logic/tokens/store/model/token'
import { safesMapSelector } from 'src/logic/safe/store/selectors'

describe('Feature > Balances', () => {
  let store
  const safeAddress = '0xdfA693da0D16F5E7E78FdCBeDe8FC6eBEa44f1Cf'
  beforeEach(async () => {
    store = aNewStore()
  })

  it('It should return an updated balance when updates active tokens', async () => {
    // given
    const tokensAmount = '100'
    const token = makeToken({
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
    const expectedResult = '100'

    // when
    store.dispatch(updateSafe({ address: safeAddress, balances }))
    store.dispatch(updateActiveTokens(safeAddress, Set([token.address])))

    const safe = safesMapSelector(store.getState()).get(safeAddress)
    const balanceResult = safe?.get('balances').get(token.address)
    const activeTokens = safe?.get('activeTokens')
    const tokenIsActive = activeTokens?.has(token.address)

    // then
    expect(balanceResult).toBe(expectedResult)
    expect(tokenIsActive).toBe(true)
  })

  it('The store should have an updated ether balance after updating the value', async () => {
    // given
    const etherAmount = '1'
    const expectedResult = '1'

    // when
    store.dispatch(updateSafe({ address: safeAddress, ethBalance: etherAmount }))
    const safe = safesMapSelector(store.getState()).get(safeAddress)
    const balanceResult = safe?.get('ethBalance')

    // then
    expect(balanceResult).toBe(expectedResult)
  })
})
