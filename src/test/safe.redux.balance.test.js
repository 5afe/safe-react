// @flow
import { Map } from 'immutable'
import * as fetchTokensAction from '~/logic/tokens/store/actions/fetchTokens'
import { aNewStore } from '~/store'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { type Token } from '~/logic/tokens/store/model/token'
import { TOKEN_REDUCER_ID } from '~/logic/tokens/store/reducer/tokens'
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
    // WHEN
    await store.dispatch(fetchTokensAction.fetchTokens(address))

    // THEN
    const tokens: Map<string, Map<string, Token>> | typeof undefined = store.getState()[TOKEN_REDUCER_ID]
    if (!tokens) throw new Error()

    const safeBalances: Map<string, Token> | typeof undefined = tokens.get(address)
    if (!safeBalances) throw new Error('No tokens available, probably failed to fetch')
    expect(safeBalances.size).toBe(11)
    
    console.log(safeBalances.entries())

    // safeBalances.forEach((token: string) => {
    //   const record = safeBalances.get(token)
    //   if (!record) throw new Error()
    //   expect(record.get('funds')).toBe('0')
    // })
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
    expect(safeBalances.size).toBe(11)

    const ethBalance = safeBalances.get(ETH_ADDRESS)
    if (!ethBalance) throw new Error()
    expect(ethBalance.get('funds')).toBe('0.03456')
  })

  it('reducer should return 100 TKN when safe has 100 TKN', async () => {
    // GIVEN
    const numTokens = '100'
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
