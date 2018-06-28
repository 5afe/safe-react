// @flow
import { Map } from 'immutable'
import { BALANCE_REDUCER_ID } from '~/routes/safe/store/reducer/balances'
import * as fetchBalancesAction from '~/routes/safe/store/actions/fetchBalances'
import { aNewStore } from '~/store'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { type Balance, makeBalance } from '~/routes/safe/store/model/balance'
import addBalances from '~/routes/safe/store/actions/addBalances'
import { addEtherTo, addTknTo } from '~/test/utils/tokenMovements'

describe('Safe Actions[fetchBalance]', () => {
  let store
  let address: string
  beforeEach(async () => {
    store = aNewStore()
    address = await aMinedSafe(store)
  })

  it('reducer should return 0 to just deployed safe', async () => {
    // GIVEN
    const tokenList = ['WE', '<3', 'GNO', 'OMG', 'RDN']

    // WHEN
    await store.dispatch(fetchBalancesAction.fetchBalances(address))

    // THEN
    const balances: Map<string, Map<string, Balance>> | typeof undefined = store.getState()[BALANCE_REDUCER_ID]
    if (!balances) throw new Error()

    const safeBalances: Map<string, Balance> | typeof undefined = balances.get(address)
    if (!safeBalances) throw new Error()
    expect(safeBalances.size).toBe(6)

    tokenList.forEach((token: string) => {
      const record = safeBalances.get(token)
      if (!record) throw new Error()
      expect(record.get('funds')).toBe('0')
    })
  })

  it('reducer should return 0.03456 ETH as funds to safe with 0.03456 ETH', async () => {
    // WHEN
    await addEtherTo(address, '0.03456')
    await store.dispatch(fetchBalancesAction.fetchBalances(address))

    // THEN
    const balances: Map<string, Map<string, Balance>> | typeof undefined = store.getState()[BALANCE_REDUCER_ID]
    if (!balances) throw new Error()

    const safeBalances: Map<string, Balance> | typeof undefined = balances.get(address)
    if (!safeBalances) throw new Error()
    expect(safeBalances.size).toBe(6)

    const ethBalance = safeBalances.get('ETH')
    if (!ethBalance) throw new Error()
    expect(ethBalance.get('funds')).toBe('0.03456')
  })

  it('reducer should return 100 TKN when safe has 100 TKN', async () => {
    // GIVEN
    const numTokens = 100
    const tokenAddress = await addTknTo(address, numTokens)

    // WHEN
    const fetchBalancesMock = jest.spyOn(fetchBalancesAction, 'fetchBalances')
    const funds = await fetchBalancesAction.calculateBalanceOf(tokenAddress, address)

    const balances: Map<string, Balance> = Map().set('TKN', makeBalance({
      address: tokenAddress,
      name: 'Token',
      symbol: 'TKN',
      decimals: 18,
      logoUrl: 'https://github.com/TrustWallet/tokens/blob/master/images/0x6810e776880c02933d47db1b9fc05908e5386b96.png?raw=true',
      funds,
    }))
    fetchBalancesMock.mockImplementation(() => store.dispatch(addBalances(address, balances)))
    await store.dispatch(fetchBalancesAction.fetchBalances(address))
    fetchBalancesMock.mockRestore()

    // THEN
    const safeBalances = store.getState()[BALANCE_REDUCER_ID].get(address)
    expect(safeBalances.size).toBe(1)

    const tknBalance = safeBalances.get('TKN')
    expect(tknBalance.get('funds')).toBe(String(numTokens))
  })
})
