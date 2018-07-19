// @flow
import { Map } from 'immutable'
import * as fetchTokensAction from '~/routes/tokens/store/actions/fetchTokens'
import { aNewStore } from '~/store'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { type Token } from '~/routes/tokens/store/model/token'
import { TOKEN_REDUCER_ID } from '~/routes/tokens/store/reducer/tokens'
import { addEtherTo, addTknTo } from '~/test/utils/tokenMovements'
import { dispatchTknBalance } from '~/test/utils/transactions/moveTokens.helper'
import { ETH_ADDRESS } from '~/utils/tokens'

describe('Safe - redux balance property', () => {
  let store
  let address: string
  beforeEach(async () => {
    store = aNewStore()
    address = await aMinedSafe(store)
  })

  it('reducer should return 0 to just deployed safe', async () => {
    // GIVEN
    const tokenList = [
      '0x975be7f72cea31fd83d0cb2a197f9136f38696b7', // WE
      '0xb3a4bc89d8517e0e2c9b66703d09d3029ffa1e6d', // <3
      '0x5f92161588c6178130ede8cbdc181acec66a9731', // GNO
      '0xb63d06025d580a94d59801f2513f5d309c079559', // OMG
      '0x3615757011112560521536258c1E7325Ae3b48AE', // RDN
      '0xc778417E063141139Fce010982780140Aa0cD5Ab', // Wrapped Ether
      '0x979861dF79C7408553aAF20c01Cfb3f81CCf9341', // OLY
      '0', // ETH
    ]

    // WHEN
    await store.dispatch(fetchTokensAction.fetchTokens(address))

    // THEN
    const tokens: Map<string, Map<string, Token>> | typeof undefined = store.getState()[TOKEN_REDUCER_ID]
    if (!tokens) throw new Error()

    const safeBalances: Map<string, Token> | typeof undefined = tokens.get(address)
    if (!safeBalances) throw new Error()
    expect(safeBalances.size).toBe(8)

    tokenList.forEach((token: string) => {
      const record = safeBalances.get(token)
      if (!record) throw new Error()
      expect(record.get('funds')).toBe('0')
    })
  })

  it('reducer should return 0.03456 ETH as funds to safe with 0.03456 ETH', async () => {
    // WHEN
    await addEtherTo(address, '0.03456')
    await store.dispatch(fetchTokensAction.fetchTokens(address))

    // THEN
    const tokens: Map<string, Map<string, Token>> | typeof undefined = store.getState()[TOKEN_REDUCER_ID]
    if (!tokens) throw new Error()

    const safeBalances: Map<string, Token> | typeof undefined = tokens.get(address)
    if (!safeBalances) throw new Error()
    expect(safeBalances.size).toBe(8)

    const ethBalance = safeBalances.get(ETH_ADDRESS)
    if (!ethBalance) throw new Error()
    expect(ethBalance.get('funds')).toBe('0.03456')
  })

  it('reducer should return 100 TKN when safe has 100 TKN', async () => {
    // GIVEN
    const numTokens = 100
    const tokenAddress = await addTknTo(address, numTokens)

    // WHEN
    await dispatchTknBalance(store, tokenAddress, address)

    // THEN
    const safeBalances = store.getState()[TOKEN_REDUCER_ID].get(address)
    expect(safeBalances.size).toBe(1)

    const tknBalance = safeBalances.get('TKN')
    expect(tknBalance.get('funds')).toBe(String(numTokens))
  })
})
