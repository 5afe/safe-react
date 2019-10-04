// @flow
import { waitForElement } from '@testing-library/react'
import { Set, Map } from 'immutable'
import { aNewStore } from '~/store'
import { sleep } from '~/utils/timer'
import { aMinedSafe } from '~/test/builder/safe.redux.builder'
import { sendTokenTo, sendEtherTo } from '~/test/utils/tokenMovements'
import { renderSafeView } from '~/test/builder/safe.dom.utils'
import { dispatchAddTokenToList } from '~/test/utils/transactions/moveTokens.helper'
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

    const balances = Map({
      [tokenAddress]: safeTokenBalance,
    })
    store.dispatch(updateActiveTokens(safeAddress, Set([tokenAddress])))
    store.dispatch(updateSafe({ address: safeAddress, balances }))
    await sleep(1000)

    const balanceRows = SafeDom.getAllByTestId(BALANCE_ROW_TEST_ID)
    expect(balanceRows.length).toBe(2)

    await waitForElement(() => SafeDom.getByText(`${tokensAmount} OMG`))

    await sendTokenTo(safeAddress, tokensAmount)

    await waitForElement(() => SafeDom.getByText(`${parseInt(tokensAmount, 10) * 2} OMG`))
  })

  it('Updates ether balance automatically', async () => {
    const etherAmount = '1'
    await sendEtherTo(safeAddress, etherAmount)

    const SafeDom = await renderSafeView(store, safeAddress)

    const safeEthBalance = await getBalanceInEtherOf(safeAddress)
    expect(safeEthBalance).toBe(etherAmount)

    const balanceRows = SafeDom.getAllByTestId(BALANCE_ROW_TEST_ID)
    expect(balanceRows.length).toBe(1)

    await waitForElement(() => SafeDom.getByText(`${etherAmount} ETH`))

    await sendEtherTo(safeAddress, etherAmount)

    await waitForElement(() => SafeDom.getByText(`${parseInt(etherAmount, 10) * 2} ETH`))
  })
})
