// @flow
import { List } from 'immutable'
import { aNewStore } from '~/store'
import { sleep } from '~/utils/timer'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { sendTokenTo, sendEtherTo } from '~/test/utils/tokenMovements'
import { renderSafeView } from '~/test/builder/safe.dom.utils'
import { dispatchAddTokenToList } from '~/test/utils/transactions/moveTokens.helper'
import TokenBalanceRecord from '~/routes/safe/store/models/tokenBalance'
import { calculateBalanceOf } from '~/routes/safe/store/actions/fetchTokenBalances'
import updateActiveTokens from '~/routes/safe/store/actions/updateActiveTokens'
import '@testing-library/jest-dom/extend-expect'
import updateSafe from '~/routes/safe/store/actions/updateSafe'
import { BALANCE_ROW_TEST_ID } from '~/routes/safe/components/Balances'
import { getBalanceInEtherOf } from '~/logic/wallets/getWeb3'

describe('DOM > Feature > Balances', () => {
  let store
  let safeAddress: string
  beforeEach(async () => {
    store = aNewStore()
    safeAddress = await aMinedSafe(store)
  })

  it('Updates token balances automatically', async () => {
    const tokensAmount = '100'
    const tokenAddress = await sendTokenTo(safeAddress, tokensAmount)
    await dispatchAddTokenToList(store, tokenAddress)

    const SafeDom = await renderSafeView(store, safeAddress)

    // Activate token
    const safeTokenBalance = await calculateBalanceOf(tokenAddress, safeAddress, 18)
    expect(safeTokenBalance).toBe(tokensAmount)

    const balanceAsRecord = TokenBalanceRecord({
      address: tokenAddress,
      balance: safeTokenBalance,
    })
    store.dispatch(updateActiveTokens(safeAddress, List([tokenAddress])))
    store.dispatch(updateSafe({ address: safeAddress, balances: List([balanceAsRecord]) }))
    await sleep(1000)

    const balanceRows = SafeDom.getAllByTestId(BALANCE_ROW_TEST_ID)
    expect(balanceRows.length).toBe(2)

    expect(balanceRows[1]).toHaveTextContent(`${tokensAmount} FTE`)

    await sendTokenTo(safeAddress, tokensAmount)

    await sleep(2000)

    expect(balanceRows[2]).toHaveTextContent(`${parseInt(tokensAmount, 10) * 2} FTE`)
  })

  it('Updates ether balance automatically', async () => {
    const etherAmount = '1'
    await sendEtherTo(safeAddress, etherAmount)

    const SafeDom = await renderSafeView(store, safeAddress)

    const safeEthBalance = await getBalanceInEtherOf(safeAddress)
    expect(safeEthBalance).toBe(etherAmount)

    const balanceRows = SafeDom.getAllByTestId(BALANCE_ROW_TEST_ID)
    expect(balanceRows.length).toBe(1)

    expect(balanceRows[0]).toHaveTextContent(`${etherAmount} ETH`)

    await sendEtherTo(safeAddress, etherAmount)
    await sleep(2000)

    expect(balanceRows[0]).toHaveTextContent(`${parseInt(etherAmount, 10) * 2} ETH`)
  })
})
